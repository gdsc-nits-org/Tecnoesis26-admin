import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { requireModuleAccess } from '$lib/server/admin';
import { uploadImageToCloudinary } from '$lib/server/cloudinary';

export const load: PageServerLoad = async ({ locals, params }) => {
	const access = await requireModuleAccess(locals, params.module);
	if (!access.isSuperAdmin && !(access.hasModuleAccess && access.module.admin_editable === true)) {
		throw redirect(303, `/modules/${params.module}`);
	}
	return { module: access.module, isSuperAdmin: access.isSuperAdmin };
};

export const actions: Actions = {
	updateDetails: async ({ request, locals, params }) => {
		const { supabase } = await requireModuleAccess(locals, params.module);
		if (locals.user?.role !== 'super_admin') {
			return fail(403, { error: 'You are not allowed to edit this module.' });
		}
		const formData = await request.formData();
		const moduleId = String(formData.get('moduleId') ?? '').trim();
		const email = String(formData.get('email') ?? '')
			.trim()
			.toLowerCase();
		const name = String(formData.get('name') ?? '').trim();

		if (!moduleId || !email || !name)
			return fail(400, { error: 'Name, route name, and email are required.' });

		const published = formData.get('published') === 'on';
		const { error } = await supabase
			.from('modules')
			.update({
				module_id: moduleId,
				name,
				email,
				description: String(formData.get('description') ?? '').trim() || null,
				third_party_url: String(formData.get('thirdPartyUrl') ?? '').trim() || null,
				admin_editable: formData.get('adminEditable') === 'on',
				can_create_events: formData.get('canCreateEvents') === 'on',
				published
			})
			.eq('module_id', params.module);

		if (error) {
			console.error('Update error:', error);
			return fail(500, { error: 'Failed to update module details.' });
		}

		const eventModuleId = moduleId !== params.module ? moduleId : params.module;
		if (moduleId !== params.module) {
			const { error: eventError } = await supabase
				.from('events')
				.update({ module_id: eventModuleId, ...(published ? {} : { published: false }) })
				.eq('module_id', params.module);

			if (eventError) {
				console.error('Event module route update failed:', eventError);
				return fail(500, { error: 'Module updated, but related events could not be moved.' });
			}
		} else if (!published) {
			const { error: eventError } = await supabase
				.from('events')
				.update({ published: false })
				.eq('module_id', params.module);

			if (eventError) {
				console.error('Event publication update failed:', eventError);
				return fail(500, { error: 'Module updated, but related events could not be unpublished.' });
			}
		}

		return { success: true };
	},

	updateImage: async ({ request, locals, params }) => {
		const { supabase, module, isSuperAdmin, hasModuleAccess } = await requireModuleAccess(
			locals,
			params.module
		);
		if (!isSuperAdmin && !(hasModuleAccess && module.admin_editable === true)) {
			return fail(403, { error: 'You are not allowed to edit this module.' });
		}

		const formData = await request.formData();
		const imageType = formData.get('imageType');
		const file = formData.get('image');
		if (imageType !== 'cover') {
			return fail(400, { error: 'Invalid module image type.' });
		}
		if (!(file instanceof File) || file.size === 0) {
			return fail(400, { error: 'Select an image to upload.' });
		}
		if (!file.type.startsWith('image/')) {
			return fail(400, { error: 'Only image files are allowed.' });
		}

		try {
			const imageUrl = await uploadImageToCloudinary(file);
			const { error } = await supabase
				.from('modules')
				.update({ cover_image: imageUrl })
				.eq('module_id', params.module);

			if (error) throw error;
			return { imageSuccess: true };
		} catch (err) {
			console.error('Module image upload failed:', err);
			return fail(500, { error: 'Failed to upload and save module image.' });
		}
	}
};

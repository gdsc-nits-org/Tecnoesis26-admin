import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { uploadImageToCloudinary } from '$lib/server/cloudinary';
import { requireSuperAdmin } from '$lib/server/admin';

export const actions: Actions = {
	create: async ({ request, locals }) => {
		const { supabase } = await requireSuperAdmin(locals);
		const formData = await request.formData();

		const name = String(formData.get('name') ?? '').trim();
		const moduleId = String(formData.get('moduleId') ?? '').trim();
		const email = String(formData.get('email') ?? '')
			.trim()
			.toLowerCase();
		const description = String(formData.get('description') ?? '').trim();
		const thirdPartyUrl = String(formData.get('thirdPartyUrl') ?? '').trim();
		const adminEditable = formData.get('adminEditable') === 'on';
		const canCreateEvents = formData.get('canCreateEvents') === 'on';
		const published = formData.get('published') === 'on';

		if (!name || !moduleId || !email) {
			return fail(400, { error: 'Name, route name, and admin email are required.' });
		}

		const coverFile = formData.get('coverImage') as File | null;
		let coverImage: string | null = null;

		try {
			if (coverFile && coverFile.size > 0) {
				coverImage = await uploadImageToCloudinary(coverFile);
			}
		} catch (err) {
			console.error('Image upload failed:', err);
			return fail(500, { error: 'Failed to upload image. Check Cloudinary config.' });
		}
		if (!coverImage) return fail(400, { error: 'A cover image is required.' });

		const { error: dbError } = await supabase.from('modules').insert({
			name,
			module_id: moduleId,
			email,
			description: description || null,
			cover_image: coverImage,
			third_party_url: thirdPartyUrl || null,
			admin_editable: adminEditable,
			can_create_events: canCreateEvents,
			published
		});

		if (dbError) {
			console.error('Database error:', dbError);
			return fail(500, { error: 'Failed to create module.' });
		}

		throw redirect(303, '/modules');
	}
};

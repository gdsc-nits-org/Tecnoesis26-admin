import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { requireModuleAccess } from '$lib/server/admin';

export const load: PageServerLoad = async ({ locals, params }) => {
	const { module } = await requireModuleAccess(locals, params.module);
	if (locals.user?.role !== 'super_admin') {
		throw redirect(303, `/modules/${params.module}`);
	}
	return { module };
};

export const actions: Actions = {
	updateDetails: async ({ request, locals, params }) => {
		const { supabase } = await requireModuleAccess(locals, params.module);
		if (locals.user?.role !== 'super_admin') {
			return fail(403, { error: 'You are not allowed to edit this module.' });
		}
		const formData = await request.formData();
		const moduleId = String(formData.get('moduleId') ?? '').trim();
		const email = String(formData.get('email') ?? '').trim().toLowerCase();
		const name = String(formData.get('name') ?? '').trim();

		if (!moduleId || !email || !name) return fail(400, { error: 'Name, route name, and email are required.' });

		const { error } = await supabase
			.from('modules')
			.update({
				module_id: moduleId,
				name,
				email,
				description: String(formData.get('description') ?? '').trim() || null,
				third_party_url: String(formData.get('thirdPartyUrl') ?? '').trim() || null,
				admin_editable: formData.get('adminEditable') === 'on',
				can_create_events: formData.get('canCreateEvents') === 'on'
			})
			.eq('module_id', params.module);

		if (error) {
			console.error('Update error:', error);
			return fail(500, { error: 'Failed to update module details.' });
		}

		if (moduleId !== params.module) {
			const { error: eventError } = await supabase
				.from('events')
				.update({ module_id: moduleId })
				.eq('module_id', params.module);

			if (eventError) {
				console.error('Event module route update failed:', eventError);
				return fail(500, { error: 'Module updated, but related events could not be moved.' });
			}
		}

		return { success: true };
	}
};

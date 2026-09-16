import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { uploadImageToCloudinary } from '$lib/server/cloudinary';
import { requireEventAccess } from '$lib/server/admin';

export const load: PageServerLoad = async ({ locals, params, url }) => {
	const eventId = params.events || url.searchParams.get('eventId');

	if (!eventId) throw redirect(303, '/modules');

	const { event, hasModuleAccess } = await requireEventAccess(locals, params.module, eventId);

	return { event, hasModuleAccess };
};

export const actions: Actions = {
	updateDetails: async ({ request, locals, params, url }) => {
		const formData = await request.formData();
		const eventId = String(formData.get('eventId') ?? params.events ?? url.searchParams.get('eventId') ?? '');

		if (!eventId) return fail(400, { error: 'Event ID missing.' });
		const { supabase, event } = await requireEventAccess(locals, params.module, eventId);
		const eventEmail = locals.user?.role === 'super_admin'
			? String(formData.get('email') ?? '').trim().toLowerCase() || null
			: event.email;

		const { error } = await supabase
			.from('events')
			.update({
				event_id: String(formData.get('eventRoute') ?? '').trim() || null,
				email: eventEmail,
				name: formData.get('name'),
				description: formData.get('description'),
				venue: formData.get('venue'),
				min_team_size: parseInt(formData.get('minTeamSize') as string) || 1,
				max_team_size: parseInt(formData.get('maxTeamSize') as string) || 4,
				registration_end_time: formData.get('registrationEndTime'),
				prize_description: formData.get('prizeDescription'),
				stages_description: formData.get('stagesDescription')
			})
			.eq('id', event.id);

		if (error) {
			console.error('Update error:', error);
			return fail(500, { error: 'Failed to update event details.' });
		}

		return { success: true };
	},

	updateImage: async ({ request, locals, params, url }) => {
		const formData = await request.formData();
		const eventId = String(formData.get('eventId') ?? params.events ?? url.searchParams.get('eventId') ?? '');
		const imageType = formData.get('imageType') as 'banner' | 'poster';
		const file = formData.get('image') as File;

		if (!eventId) return fail(400, { error: 'Event ID missing.' });
		if (!file || file.size === 0) return fail(400, { error: 'No file provided.' });
		const { supabase, event } = await requireEventAccess(locals, params.module, eventId);

		try {
			const imageUrl = await uploadImageToCloudinary(file);
			const updateData =
				imageType === 'banner' ? { banner_image: imageUrl } : { poster_image: imageUrl };

			const { error } = await supabase.from('events').update(updateData).eq('id', event.id);

			if (error) throw error;
			return { success: true };
		} catch (err) {
			console.error('Image upload error:', err);
			return fail(500, { error: 'Failed to upload and save image.' });
		}
	},

	deleteEvent: async ({ request, locals, params, url }) => {
		const formData = await request.formData();
		const eventId = String(formData.get('eventId') ?? params.events ?? url.searchParams.get('eventId') ?? '');
		const moduleId = params.module;

		if (!eventId) return fail(400, { error: 'Event ID missing.' });
		const { supabase, event, hasModuleAccess } = await requireEventAccess(locals, moduleId, eventId);
		if (!hasModuleAccess) return fail(403, { error: 'Only admins with module access can delete events.' });

		const { error } = await supabase.from('events').delete().eq('id', event.id);

		if (error) {
			console.error('Delete error:', error);
			return fail(500, { error: 'Failed to delete event.' });
		}

		throw redirect(303, `/modules/${moduleId}`);
	}
};

import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { getSupabaseServerClient } from '$lib/supabase';
import { uploadImageToCloudinary } from '$lib/server/cloudinary';

export const load: PageServerLoad = async ({ cookies, url }) => {
	const supabase = getSupabaseServerClient(cookies);
	const eventId = url.searchParams.get('eventId');

	if (!eventId) throw redirect(303, '/modules');

	const { data: event, error } = await supabase
		.from('events')
		.select('*')
		.eq('id', eventId)
		.single();

	if (error || !event) {
		console.error('Error fetching event:', error);
		throw redirect(303, '/modules');
	}

	return { event };
};

export const actions: Actions = {
	updateDetails: async ({ request, cookies }) => {
		const supabase = getSupabaseServerClient(cookies);
		const formData = await request.formData();

		// Read eventId from the hidden form field, not the URL
		const eventId = formData.get('eventId') as string;

		if (!eventId) return fail(400, { error: 'Event ID missing.' });

		const { error } = await supabase
			.from('events')
			.update({
				name: formData.get('name'),
				description: formData.get('description'),
				venue: formData.get('venue'),
				min_team_size: parseInt(formData.get('minTeamSize') as string) || 1,
				max_team_size: parseInt(formData.get('maxTeamSize') as string) || 4,
				registration_end_time: formData.get('registrationEndTime'),
				prize_description: formData.get('prizeDescription'),
				stages_description: formData.get('stagesDescription')
			})
			.eq('id', eventId);

		if (error) {
			console.error('Update error:', error);
			return fail(500, { error: 'Failed to update event details.' });
		}

		return { success: true };
	},

	updateImage: async ({ request, cookies }) => {
		const supabase = getSupabaseServerClient(cookies);
		const formData = await request.formData();

		// Read eventId from the hidden form field, not the URL
		const eventId = formData.get('eventId') as string;
		const imageType = formData.get('imageType') as 'banner' | 'poster';
		const file = formData.get('image') as File;

		if (!eventId) return fail(400, { error: 'Event ID missing.' });
		if (!file || file.size === 0) return fail(400, { error: 'No file provided.' });

		try {
			const imageUrl = await uploadImageToCloudinary(file);
			const updateData =
				imageType === 'banner' ? { banner_image: imageUrl } : { poster_image: imageUrl };

			const { error } = await supabase.from('events').update(updateData).eq('id', eventId);

			if (error) throw error;
			return { success: true };
		} catch (err) {
			console.error('Image upload error:', err);
			return fail(500, { error: 'Failed to upload and save image.' });
		}
	},

	deleteEvent: async ({ request, cookies, params }) => {
		const supabase = getSupabaseServerClient(cookies);
		const formData = await request.formData();

		// Read eventId from the hidden form field, not the URL
		const eventId = formData.get('eventId') as string;
		const moduleId = params.module;

		if (!eventId) return fail(400, { error: 'Event ID missing.' });

		const { error } = await supabase.from('events').delete().eq('id', eventId);

		if (error) {
			console.error('Delete error:', error);
			return fail(500, { error: 'Failed to delete event.' });
		}

		throw redirect(303, `/modules/${moduleId}`);
	}
};

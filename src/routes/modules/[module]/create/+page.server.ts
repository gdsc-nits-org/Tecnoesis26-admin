import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { uploadImageToCloudinary } from '$lib/server/cloudinary';
import { requireModuleAccess } from '$lib/server/admin';

export const actions: Actions = {
	create: async ({ request, params, locals }) => {
		const { supabase, hasModuleAccess } = await requireModuleAccess(locals, params.module);
		if (!hasModuleAccess) {
			return fail(403, { error: 'You are not allowed to create events in this module.' });
		}
		const moduleId = params.module;
		const formData = await request.formData();

		const name = formData.get('name') as string;
		const eventId = String(formData.get('eventId') ?? '').trim();
		const eventEmail =
			locals.user?.role === 'super_admin'
				? String(formData.get('email') ?? '')
						.trim()
						.toLowerCase() || null
				: null;
		const description = formData.get('description') as string;
		const venue = formData.get('venue') as string;
		const minTeamSize = parseInt(formData.get('minTeamSize') as string) || 1;
		const maxTeamSize = parseInt(formData.get('maxTeamSize') as string) || 4;
		const registrationEndTime = formData.get('registrationEndTime') as string;
		const prizeDescription = formData.get('prizeDescription') as string;
		const stagesDescription = formData.get('stagesDescription') as string;

		if (!eventId || !name || !venue || !registrationEndTime) {
			return fail(400, {
				error: 'Event route name, name, venue, and registration date are required.'
			});
		}

		// Handle Image Uploads
		const posterFile = formData.get('poster') as File | null;
		const bannerFile = formData.get('banner') as File | null;

		let posterImage = null;
		let bannerImage = null;

		try {
			if (posterFile && posterFile.size > 0) {
				posterImage = await uploadImageToCloudinary(posterFile);
			}
			if (bannerFile && bannerFile.size > 0) {
				bannerImage = await uploadImageToCloudinary(bannerFile);
			}
		} catch (err) {
			console.error('Image upload failed', err);
			return fail(500, { error: 'Failed to upload images to Cloudinary.' });
		}

		// Insert into Supabase
		const { error: dbError } = await supabase.from('events').insert({
			module_id: moduleId,
			event_id: eventId,
			email: eventEmail,
			name,
			description,
			venue,
			min_team_size: minTeamSize,
			max_team_size: maxTeamSize,
			registration_end_time: registrationEndTime,
			prize_description: prizeDescription,
			stages_description: stagesDescription,
			poster_image: posterImage,
			banner_image: bannerImage
		});

		if (dbError) {
			console.error('Database Error:', dbError);
			return fail(500, { error: 'Failed to create event in database. Check your schema.' });
		}

		// On success, redirect back to the module's event list
		throw redirect(303, `/modules/${moduleId}`);
	}
};

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

		const name = String(formData.get('name') ?? '').trim();
		const eventId = String(formData.get('eventId') ?? '').trim();
		const isSuperAdmin = locals.user?.role === 'super_admin';
		const eventEmail = isSuperAdmin
			? String(formData.get('email') ?? '')
					.trim()
					.toLowerCase() || null
			: null;
		const description = String(formData.get('description') ?? '').trim();
		const venue = String(formData.get('venue') ?? '').trim();
		const minTeamSizeValue = String(formData.get('minTeamSize') ?? '').trim();
		const maxTeamSizeValue = String(formData.get('maxTeamSize') ?? '').trim();
		const parsedMinTeamSize = Number.parseInt(minTeamSizeValue, 10);
		const parsedMaxTeamSize = Number.parseInt(maxTeamSizeValue, 10);
		const minTeamSize = Number.isNaN(parsedMinTeamSize) ? 1 : parsedMinTeamSize;
		const maxTeamSize = Number.isNaN(parsedMaxTeamSize) ? 4 : parsedMaxTeamSize;
		const registrationEndTime = String(formData.get('registrationEndTime') ?? '').trim();
		const prizeDescription = String(formData.get('prizeDescription') ?? '').trim();
		const stagesDescription = String(formData.get('stagesDescription') ?? '').trim();
		const posterFile = formData.get('poster') as File | null;
		const bannerFile = formData.get('banner') as File | null;

		if (!eventId || !name) {
			return fail(400, { error: 'Event route name and name are required.' });
		}
		if (isSuperAdmin && !eventEmail) {
			return fail(400, { error: 'An admin email is required to give access to this event.' });
		}
		if (
			!isSuperAdmin &&
			(!description ||
				!venue ||
				!minTeamSizeValue ||
				!maxTeamSizeValue ||
				!Number.isInteger(parsedMinTeamSize) ||
				!Number.isInteger(parsedMaxTeamSize) ||
				parsedMinTeamSize < 1 ||
				parsedMaxTeamSize < parsedMinTeamSize ||
				!registrationEndTime ||
				!prizeDescription ||
				!stagesDescription ||
				!posterFile?.size ||
				!bannerFile?.size)
		) {
			return fail(400, {
				error: 'Complete all event details, team sizes, and upload both poster and banner images.'
			});
		}

		// Handle Image Uploads
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

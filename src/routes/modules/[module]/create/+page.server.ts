import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { getSupabaseServerClient } from '$lib/supabase';
import { uploadImageToCloudinary } from '$lib/server/cloudinary';

export const actions: Actions = {
	create: async ({ request, cookies, params }) => {
		const supabase = getSupabaseServerClient(cookies);
		const moduleId = params.module;
		const formData = await request.formData();

		const name = formData.get('name') as string;
		const description = formData.get('description') as string;
		const venue = formData.get('venue') as string;
		const minTeamSize = parseInt(formData.get('minTeamSize') as string) || 1;
		const maxTeamSize = parseInt(formData.get('maxTeamSize') as string) || 4;
		const registrationEndTime = formData.get('registrationEndTime') as string;
		const prizeDescription = formData.get('prizeDescription') as string;
		const stagesDescription = formData.get('stagesDescription') as string;

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
			console.error("Image upload failed", err);
			return fail(500, { error: 'Failed to upload images to Cloudinary.' });
		}

		// Insert into Supabase
		const { error: dbError } = await supabase.from('events').insert({
			module_id: moduleId,
			name,
			description,
			venue,
			min_team_size: minTeamSize,
			max_team_size: maxTeamSize,
			registration_end_time: registrationEndTime,
			prize_description: prizeDescription,
			stages_description: stagesDescription,
			poster_image: posterImage,
			banner_image: bannerImage,
		});

		if (dbError) {
			console.error('Database Error:', dbError);
			return fail(500, { error: 'Failed to create event in database. Check your schema.' });
		}

		// On success, redirect back to the module's event list
		throw redirect(303, `/modules/${moduleId}`);
	}
};
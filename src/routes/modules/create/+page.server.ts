import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { getSupabaseAdminClient } from '$lib/supabase';
import { uploadImageToCloudinary } from '$lib/server/cloudinary';

export const actions: Actions = {
	create: async ({ request }) => {
		const supabase = getSupabaseAdminClient();
		const formData = await request.formData();

		const name = formData.get('name') as string;
		const description = formData.get('description') as string;
		const thirdPartyUrl = formData.get('thirdPartyUrl') as string;

		if (!name) {
			return fail(400, { error: 'Module name is required.' });
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

		const { error: dbError } = await supabase.from('modules').insert({
			name,
			description: description || null,
			cover_image: coverImage,
			third_party_url: thirdPartyUrl || null
		});

		if (dbError) {
			console.error('Database error:', dbError);
			return fail(500, { error: 'Failed to create module.' });
		}

		throw redirect(303, '/modules');
	}
};
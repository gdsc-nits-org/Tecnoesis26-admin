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

		const iconFile = formData.get('iconImage') as File | null;
		const coverFile = formData.get('coverImage') as File | null;

		let iconImage: string | null = null;
		let coverImage: string | null = null;

		try {
			if (iconFile && iconFile.size > 0) {
				iconImage = await uploadImageToCloudinary(iconFile);
			}
			if (coverFile && coverFile.size > 0) {
				coverImage = await uploadImageToCloudinary(coverFile);
			}
		} catch (err) {
			console.error('Image upload failed:', err);
			return fail(500, { error: 'Failed to upload images. Check Cloudinary config.' });
		}

		const { error: dbError } = await supabase.from('modules').insert({
			name,
			description: description || null,
			icon_image: iconImage,
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
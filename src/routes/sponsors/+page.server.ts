import { error, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import {
	deleteImageFromCloudinaryUrl,
	uploadSponsorImageToCloudinary
} from '$lib/server/cloudinary';
import { getSupabaseAdminClient } from '$lib/supabase';

const MAX_IMAGE_SIZE = 10 * 1024 * 1024;

const requireSponsorAccess = (locals: App.Locals, canEdit = false) => {
	const role = locals.user?.role;
	if (role !== 'super_admin' && role !== 'executive') {
		throw error(403, 'Only super admins and executives can access sponsors.');
	}
	if (canEdit && role !== 'super_admin') {
		throw error(403, 'Only super admins can edit or delete sponsors.');
	}
};

const validateImage = (value: FormDataEntryValue | null) => {
	if (!(value instanceof File) || value.size === 0) return 'Sponsor image is required.';
	if (!value.type.startsWith('image/')) return 'Only image files are allowed.';
	if (value.size > MAX_IMAGE_SIZE) return 'Images must be 10 MB or smaller.';
	return null;
};

export const load: PageServerLoad = async ({ locals }) => {
	requireSponsorAccess(locals);
	const { data: sponsors, error: queryError } = await getSupabaseAdminClient()
		.from('sponsors')
		.select('id, created_at, sponsor_name, sponsor_img')
		.order('created_at', { ascending: false });

	if (queryError) {
		console.error('Sponsors query failed:', queryError);
		throw error(500, 'Failed to load sponsors.');
	}

	return { sponsors: sponsors ?? [] };
};

export const actions: Actions = {
	addSponsor: async ({ request, locals }) => {
		requireSponsorAccess(locals);
		const formData = await request.formData();
		const sponsorName = String(formData.get('sponsorName') ?? '').trim();
		const image = formData.get('sponsorImg');
		const imageError = validateImage(image);

		if (!sponsorName) return fail(400, { error: 'Sponsor name is required.' });
		if (imageError) return fail(400, { error: imageError });

		let imageUrl = '';
		try {
			imageUrl = await uploadSponsorImageToCloudinary(image as File);
			const { error: insertError } = await getSupabaseAdminClient().from('sponsors').insert({
				sponsor_name: sponsorName,
				sponsor_img: imageUrl
			});

			if (insertError) {
				await deleteImageFromCloudinaryUrl(imageUrl);
				return fail(insertError.code === '23505' ? 409 : 500, {
					error:
						insertError.code === '23505'
							? 'A sponsor with this name already exists.'
							: 'Failed to add sponsor.'
				});
			}
		} catch (uploadError) {
			console.error('Sponsor upload failed:', uploadError);
			return fail(500, { error: 'Failed to upload sponsor image.' });
		}

		return { success: 'Sponsor added successfully.' };
	},

	editSponsor: async ({ request, locals }) => {
		requireSponsorAccess(locals, true);
		const formData = await request.formData();
		const id = String(formData.get('id') ?? '');
		const sponsorName = String(formData.get('sponsorName') ?? '').trim();
		const image = formData.get('sponsorImg');

		if (!id || !sponsorName) return fail(400, { error: 'Sponsor ID and name are required.' });
		if (image instanceof File && image.size > 0) {
			const imageError = validateImage(image);
			if (imageError) return fail(400, { error: imageError });
		}

		const supabase = getSupabaseAdminClient();
		const { data: sponsor, error: lookupError } = await supabase
			.from('sponsors')
			.select('sponsor_img')
			.eq('id', id)
			.single();
		if (lookupError || !sponsor) return fail(404, { error: 'Sponsor not found.' });

		let imageUrl = sponsor.sponsor_img;
		let replacementUrl: string | null = null;
		try {
			if (image instanceof File && image.size > 0) {
				replacementUrl = await uploadSponsorImageToCloudinary(image);
				imageUrl = replacementUrl;
			}

			const { error: updateError } = await supabase
				.from('sponsors')
				.update({ sponsor_name: sponsorName, sponsor_img: imageUrl })
				.eq('id', id);
			if (updateError) {
				if (replacementUrl) await deleteImageFromCloudinaryUrl(replacementUrl);
				return fail(updateError.code === '23505' ? 409 : 500, {
					error:
						updateError.code === '23505'
							? 'A sponsor with this name already exists.'
							: 'Failed to update sponsor.'
				});
			}

			if (replacementUrl) await deleteImageFromCloudinaryUrl(sponsor.sponsor_img);
		} catch (updateError) {
			console.error('Sponsor update failed:', updateError);
			return fail(500, { error: 'Failed to update sponsor.' });
		}

		return { success: 'Sponsor updated successfully.' };
	},

	deleteSponsor: async ({ request, locals }) => {
		requireSponsorAccess(locals, true);
		const id = String((await request.formData()).get('id') ?? '');
		if (!id) return fail(400, { error: 'Sponsor ID is required.' });

		const supabase = getSupabaseAdminClient();
		const { data: sponsor, error: lookupError } = await supabase
			.from('sponsors')
			.select('sponsor_img')
			.eq('id', id)
			.single();
		if (lookupError || !sponsor) return fail(404, { error: 'Sponsor not found.' });

		const { error: deleteError } = await supabase.from('sponsors').delete().eq('id', id);
		if (deleteError) {
			console.error('Sponsor delete failed:', deleteError);
			return fail(500, { error: 'Failed to delete sponsor.' });
		}

		try {
			await deleteImageFromCloudinaryUrl(sponsor.sponsor_img);
		} catch (imageError) {
			console.error('Sponsor image deletion failed:', imageError);
		}

		return { success: 'Sponsor deleted successfully.' };
	}
};

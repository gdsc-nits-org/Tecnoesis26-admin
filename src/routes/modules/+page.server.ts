import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals }) => {
	const { data: modules, error: dbError } = await locals.supabase.from('modules').select('*');

	if (dbError) {
		console.error('Supabase Error:', dbError);
		throw error(500, 'Failed to load modules.');
	}

	return { modules };
};

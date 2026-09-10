import type { PageServerLoad } from './$types';
import { getSupabaseAdminClient } from '$lib/supabase'; // <-- Must be Admin!
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async () => {
	const supabase = getSupabaseAdminClient(); // <-- Must be Admin!

	const { data: modules, error: dbError } = await supabase.from('modules').select('*');

	if (dbError) {
		console.error('Supabase Error:', dbError);
		throw error(500, 'Failed to load modules.');
	}

	return { modules };
};

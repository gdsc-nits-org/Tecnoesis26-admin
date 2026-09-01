import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getSupabaseAdminClient } from '$lib/supabase';

export const GET: RequestHandler = async () => {
	const supabase = getSupabaseAdminClient();
	const { data, error } = await supabase.from('modules').select('*').limit(10);

	if (error) {
		return json({ error: error.message }, { status: 500 });
	}

	return json({ modules: data ?? [] });
};

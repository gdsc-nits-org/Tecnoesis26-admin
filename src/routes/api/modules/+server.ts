import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getSupabaseAdminClient } from '$lib/supabase';

export const GET: RequestHandler = async ({ locals }) => {
	if (locals.user?.role === 'executive') {
		throw error(403, 'Executives cannot access modules.');
	}

	const supabase = getSupabaseAdminClient();
	const { data, error: queryError } = await supabase.from('modules').select('*').limit(10);

	if (queryError) {
		return json({ error: queryError.message }, { status: 500 });
	}

	return json({ modules: data ?? [] });
};

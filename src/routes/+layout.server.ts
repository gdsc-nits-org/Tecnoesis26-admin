import type { LayoutServerLoad } from './$types';
import { getSupabaseServerClient } from '$lib/supabase';

export const load: LayoutServerLoad = async ({ cookies }) => {
	const supabase = getSupabaseServerClient(cookies);
	const { data, error } = await supabase.auth.getUser();

	return {
		user: data.user,
		authError: error?.message ?? null
	};
};

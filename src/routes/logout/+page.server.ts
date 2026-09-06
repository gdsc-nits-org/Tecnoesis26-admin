import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { getSupabaseServerClient } from '$lib/supabase';

export const actions: Actions = {
	default: async ({ cookies }) => {
		const supabase = getSupabaseServerClient(cookies);
		await supabase.auth.signOut();
		throw redirect(303, '/login');
	}
};
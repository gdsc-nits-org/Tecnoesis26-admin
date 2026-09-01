import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { getSupabaseServerClient } from '$lib/supabase';

export const load: PageServerLoad = async ({ cookies }) => {
	const supabase = getSupabaseServerClient(cookies);
	const { data } = await supabase.auth.getUser();

	if (data.user) {
		throw redirect(303, '/modules');
	}

	return {};
};

export const actions: Actions = {
	login: async ({ request, cookies }) => {
		const formData = await request.formData();
		const email = String(formData.get('email') ?? '').trim();
		const password = String(formData.get('password') ?? '');

		if (!email || !password) {
			return fail(400, {
				error: 'Email and password are required.'
			});
		}

		const supabase = getSupabaseServerClient(cookies);
		const { error } = await supabase.auth.signInWithPassword({ email, password });

		if (error) {
			return fail(401, {
				error: error.message
			});
		}

		throw redirect(303, '/modules');
	},
	logout: async ({ cookies }) => {
		const supabase = getSupabaseServerClient(cookies);
		await supabase.auth.signOut();
		throw redirect(303, '/login');
	}
};

import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { getSupabaseServerClient } from '$lib/supabase';

export const load: PageServerLoad = async ({ cookies }) => {
	const supabase = getSupabaseServerClient(cookies);
	const { data } = await supabase.auth.getUser();

	if (data.user) {
		throw redirect(303, '/modules');
	}
};

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const formData = await request.formData();
		const email = String(formData.get('email') ?? '').trim().toLowerCase();
		const password = String(formData.get('password') ?? '');
		const confirmPassword = String(formData.get('confirmPassword') ?? '');

		if (!email || !password || !confirmPassword) {
			return fail(400, { error: 'Email and both password fields are required.', email });
		}

		if (password.length < 6) {
			return fail(400, { error: 'Password must be at least 6 characters.', email });
		}

		if (password !== confirmPassword) {
			return fail(400, { error: 'Passwords do not match.', email });
		}

		const supabase = getSupabaseServerClient(cookies);
		const { data: adminRecord, error: adminError } = await supabase
			.from('admins')
			.select('email')
			.eq('email', email)
			.single();

		if (adminError) {
			console.error('Supabase Query Error:', adminError);
		}

		if (!adminRecord) {
			return fail(403, { error: 'Access denied. You must be added by a Super Admin first.', email });
		}

		const { data, error } = await supabase.auth.signUp({ email, password });

		if (error) {
			return fail(400, { error: error.message, email });
		}

		if (!data.session) {
			return { success: true, email };
		}

		throw redirect(303, '/modules');
	}
};

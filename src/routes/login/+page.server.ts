import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { getSupabaseAdminClient, getSupabaseServerClient } from '$lib/supabase';

export const load: PageServerLoad = async ({ cookies }) => {
	const supabase = getSupabaseServerClient(cookies);
	const { data } = await supabase.auth.getUser();

	if (data.user) {
		throw redirect(303, '/modules');
	}
	return {};
};

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const formData = await request.formData();
		const email = String(formData.get('email') ?? '').trim().toLowerCase();
		const password = String(formData.get('password') ?? '');

		if (!email || !password) return fail(400, { error: 'Email and password are required.', email });

		const supabase = getSupabaseServerClient(cookies);
		const adminSupabase = getSupabaseAdminClient();
		const { data: adminRecord, error: adminError } = await adminSupabase
			.from('admins')
			.select('email')
			.ilike('email', email)
			.single();

		if (adminError) {
			console.error('Supabase Query Error:', adminError);
		}

		if (!adminRecord) {
			return fail(403, { error: 'Access denied. You must be added by a Super Admin first.' });
		}
		
		const { error } = await supabase.auth.signInWithPassword({ email, password });

		if (error) {
			return fail(401, { error: 'Invalid email or password.', email });
		}

		throw redirect(303, '/modules');
	}
};
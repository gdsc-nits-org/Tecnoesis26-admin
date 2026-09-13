import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { getSupabaseAdminClient, getSupabaseServerClient } from '$lib/supabase';
import { findAdminByEmail } from '$lib/server/admin';

const PASSWORD_PATTERN = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,16}$/;

const findAuthUserByEmail = async (email: string) => {
	const supabase = getSupabaseAdminClient();
	const perPage = 1000;
	let page = 1;

	while (true) {
		const { data, error } = await supabase.auth.admin.listUsers({ page, perPage });

		if (error) {
			console.error('Supabase Auth user lookup failed:', error);
			throw new Error('Unable to verify registration status.');
		}

		const user = data.users.find((candidate) => candidate.email?.toLowerCase() === email);
		if (user) return user;
		if (data.users.length < perPage) return null;

		page += 1;
	}
};

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

		if (password !== confirmPassword) {
			return fail(400, { error: 'Passwords do not match.', email });
		}

		if (!PASSWORD_PATTERN.test(password)) {
			return fail(400, {
				error: 'Password must be 8-16 characters and include uppercase, lowercase, number, and special character.',
				email
			});
		}

		const supabase = getSupabaseServerClient(cookies);
		const adminSupabase = getSupabaseAdminClient();
		const authUser = await findAuthUserByEmail(email);

		if (authUser) {
			return fail(409, {
				error: 'This email is already registered. Please log in instead.',
				email
			});
		}

		const { admin: adminRecord, error: adminError } = await findAdminByEmail(email);

		if (adminError) {
			console.error('Supabase Query Error:', adminError);
			return fail(500, { error: 'Unable to verify admin access. Please try again later.', email });
		}

		if (!adminRecord) {
			return fail(403, { error: 'Access denied. You must be added by a Super Admin first.', email });
		}

		const { error: createError } = await adminSupabase.auth.admin.createUser({
			email,
			password,
			email_confirm: true
		});

		if (createError) {
			console.error('Supabase Auth registration failed:', createError);
			return fail(400, { error: createError.message, email });
		}

		const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });

		if (signInError) {
			console.error('Supabase Auth session creation failed:', signInError);
			return fail(500, {
				error: 'Your account was created. Please sign in to continue.',
				email
			});
		}

		throw redirect(303, '/modules');
	}
};

import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { getSupabaseServerClient } from '$lib/supabase';

const VALID_DOMAINS = [
	'@nits.ac.in',
	'@cse.nits.ac.in',
	'@ece.nits.ac.in',
	'@ee.nits.ac.in',
	'@mech.nits.ac.in',
	'@ei.nits.ac.in',
	'@civil.nits.ac.in'
];

export const load: PageServerLoad = async ({ cookies }) => {
	const supabase = getSupabaseServerClient(cookies);
	const { data } = await supabase.auth.getUser();

	if (data.user) {
		throw redirect(303, '/modules');
	}
	return {};
};

export const actions: Actions = {
	sendOtp: async ({ request, cookies }) => {
		const formData = await request.formData();
		const email = String(formData.get('email') ?? '').trim().toLowerCase();

		if (!email) return fail(400, { error: 'Email is required.' });

		// 1. Enforce Domain Whitelist
		const isValidDomain = VALID_DOMAINS.some((domain) => email.endsWith(domain));
		if (!isValidDomain) {
			return fail(403, { error: 'Please use a valid NITS email address.' });
		}

		// 2. Check if the email exists in your admins table
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
			return fail(403, { error: 'Access denied. You must be added by a Super Admin first.' });
		}
		
		// 3. Send the OTP via Supabase Auth
		const { error } = await supabase.auth.signInWithOtp({ email });

		if (error) {
			console.error('OTP Error:', error);
			return fail(500, { error: 'Failed to send OTP. Please try again later.' });
		}

		return { success: true, email };
	},

	verifyOtp: async ({ request, cookies }) => {
		const formData = await request.formData();
		const email = String(formData.get('email') ?? '').trim();
		const otp = String(formData.get('otp') ?? '').trim();

		if (!email || !otp) return fail(400, { error: 'Email and OTP are required.' });

		const supabase = getSupabaseServerClient(cookies);
		const { error } = await supabase.auth.verifyOtp({ 
			email, 
			token: otp, 
			type: 'email' 
		});

		if (error) {
			return fail(401, { error: 'Invalid or expired OTP.' });
		}

		throw redirect(303, '/modules');
	}
};
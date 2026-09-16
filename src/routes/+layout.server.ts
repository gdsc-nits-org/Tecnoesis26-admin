import type { LayoutServerLoad } from './$types';
import { getSupabaseServerClient } from '$lib/supabase';
import { findAdminByEmail } from '$lib/server/admin';
import { error as kitError } from '@sveltejs/kit';

export const load: LayoutServerLoad = async ({ cookies }) => {
	const supabase = getSupabaseServerClient(cookies);
	const { data, error } = await supabase.auth.getUser();
	let user = data.user;

	if (user?.email) {
		const { admin, error: adminError } = await findAdminByEmail(user.email);

		if (adminError) {
			console.error('Admin role lookup failed:', adminError);
			throw kitError(500, 'Unable to verify admin permissions.');
		}

		user = user ? { ...user, role: admin?.role ?? undefined } : null;
	}

	return {
		user,
		authError: error?.message ?? null
	};
};

import type { LayoutServerLoad } from './$types';
import { getSupabaseServerClient } from '$lib/supabase';
import { findAdminByEmail } from '$lib/server/admin';

export const load: LayoutServerLoad = async ({ cookies }) => {
	const supabase = getSupabaseServerClient(cookies);
	const { data, error } = await supabase.auth.getUser();
	let user = data.user;

	if (user?.email) {
		const { admin } = await findAdminByEmail(user.email);

		user = user ? { ...user, role: admin?.role ?? null } : null;
	}

	return {
		user,
		authError: error?.message ?? null
	};
};

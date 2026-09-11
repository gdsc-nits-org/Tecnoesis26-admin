import type { LayoutServerLoad } from './$types';
import { getSupabaseServerClient } from '$lib/supabase';

export const load: LayoutServerLoad = async ({ cookies }) => {
	const supabase = getSupabaseServerClient(cookies);
	const { data, error } = await supabase.auth.getUser();
	let user = data.user;

	if (user?.email) {
		const { data: admin } = await supabase
			.from('admins')
			.select('role')
			.eq('email', user.email.toLowerCase())
			.maybeSingle();

		user = user ? { ...user, role: admin?.role ?? null } : null;
	}

	return {
		user,
		authError: error?.message ?? null
	};
};

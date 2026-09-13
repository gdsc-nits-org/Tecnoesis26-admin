import { getSupabaseAdminClient } from '$lib/supabase';

export async function findAdminByEmail(email: string) {
	const normalizedEmail = email.trim().toLowerCase();
	const supabase = getSupabaseAdminClient();
	const { data, error } = await supabase.from('admins').select('email, role').limit(1000);

	if (error) {
		return { admin: null, error };
	}

	const admin = data?.find(
 		record => typeof record.email === 'string' && record.email.trim().toLowerCase() === normalizedEmail
	);

	return { admin: admin ?? null, error: null };
}

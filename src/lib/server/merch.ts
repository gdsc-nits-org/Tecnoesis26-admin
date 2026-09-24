import { error } from '@sveltejs/kit';
import { getSupabaseAdminClient } from '$lib/supabase';

export type MerchOrder = {
	id: number;
	created_at: string;
	name: string | null;
	email: string | null;
	phone: number | null;
	hostel: string | null;
	tecno: boolean | null;
	spark: boolean | null;
	size: string | null;
	gender: string | null;
	opted_in: boolean | null;
};

export async function getMerchOrders() {
	const { data, error: queryError } = await getSupabaseAdminClient()
		.from('merch')
		.select('*')
		.order('created_at', { ascending: false });

	if (queryError) {
		console.error('Merch orders query failed:', queryError);
		throw error(500, 'Failed to load merch orders.');
	}

	return (data ?? []) as MerchOrder[];
}

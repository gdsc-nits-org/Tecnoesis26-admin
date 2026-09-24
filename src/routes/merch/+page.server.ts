import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getMerchOrders } from '$lib/server/merch';

export const load: PageServerLoad = async ({ locals }) => {
	if (locals.user?.role !== 'super_admin' && locals.user?.role !== 'executive') {
		throw error(403, 'Only super admins and executives can view merch orders.');
	}

	const orders = await getMerchOrders();

	return {
		orders,
		summary: {
			total: orders.length,
			tecnoesis: orders.filter((order) => order.tecno).length,
			spark: orders.filter((order) => order.spark).length
		}
	};
};

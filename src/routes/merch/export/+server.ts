import { error, type RequestHandler } from '@sveltejs/kit';
import * as XLSX from 'xlsx';
import { getMerchOrders } from '$lib/server/merch';

export const GET: RequestHandler = async ({ locals }) => {
	if (locals.user?.role !== 'super_admin' && locals.user?.role !== 'executive') {
		throw error(403, 'Only super admins and executives can export merch orders.');
	}

	const orders = await getMerchOrders();
	const worksheet = XLSX.utils.json_to_sheet(
		orders.map((order) => ({
			ID: order.id,
			'Created At': order.created_at,
			Name: order.name ?? '',
			Email: order.email ?? '',
			Phone: order.phone ?? '',
			Hostel: order.hostel ?? '',
			Tecnoesis: order.tecno ?? false,
			Spark: order.spark ?? false,
			Size: order.size ?? '',
			Gender: order.gender ?? '',
			'Opted In': order.opted_in ?? false
		}))
	);
	const workbook = XLSX.utils.book_new();
	XLSX.utils.book_append_sheet(workbook, worksheet, 'Merch Orders');
	const workbookBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });

	return new Response(workbookBuffer, {
		headers: {
			'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
			'Content-Disposition': 'attachment; filename="merch-orders.xlsx"',
			'Cache-Control': 'no-store'
		}
	});
};

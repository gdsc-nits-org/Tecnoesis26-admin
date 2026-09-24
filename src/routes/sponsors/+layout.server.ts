import { error } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ parent }) => {
	const { user } = await parent();

	if (!user?.email || (user.role !== 'super_admin' && user.role !== 'executive')) {
		throw error(403, 'Only super admins and executives can view sponsors.');
	}

	return { user };
};

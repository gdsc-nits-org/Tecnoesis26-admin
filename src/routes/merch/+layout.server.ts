import { error } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ parent }) => {
	const { user } = await parent();

	if (!user?.email || user.role !== 'super_admin') {
		throw error(403, 'Only super admins can view merch orders.');
	}

	return { user };
};

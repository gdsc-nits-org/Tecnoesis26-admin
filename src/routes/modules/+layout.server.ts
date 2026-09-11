import { error } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ parent }) => {
    const { user } = await parent();

    if (!user?.role) {
        throw error(403, 'You are not authorized to access the admin panel.');
    }

    return { user };
};
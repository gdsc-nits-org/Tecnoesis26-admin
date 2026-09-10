import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ parent }) => {
    // 1. Grab the user object (which now includes the real role) from the root layout
    const { user } = await parent();

    // 2. Protect the route: Kick out anyone who isn't a Super Admin
    if (!user || user.role !== 'super_admin') {
        throw redirect(303, '/modules'); 
    }

    // 3. If they are a Super Admin, let them proceed
    return {
        user
    };
};
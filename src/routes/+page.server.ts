import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	if (locals.user) {
		throw redirect(303, locals.user.role === 'executive' ? '/merch' : '/modules');
	}
	throw redirect(303, '/login');
};

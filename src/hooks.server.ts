import { redirect, type Handle } from '@sveltejs/kit';
import { getSupabaseServerClient } from '$lib/supabase';
import { findAdminByEmail } from '$lib/server/admin';

export const handle: Handle = async ({ event, resolve }) => {
	const supabase = getSupabaseServerClient(event.cookies);
	event.locals.supabase = supabase;

	const {
		data: { user }
	} = await supabase.auth.getUser();

	if (user?.email) {
		const { admin, error: adminError } = await findAdminByEmail(user.email);
		if (adminError) {
			console.error('Admin role lookup failed:', adminError);
			throw new Error('Unable to verify admin permissions.');
		}
		event.locals.user = { ...user, role: admin?.role ?? undefined };
	} else {
		event.locals.user = user;
	}

	const isLoginPage = (event.url.pathname.startsWith('/login') || event.url.pathname.startsWith('/register'));

	if (!user && !isLoginPage) {
		throw redirect(303, '/login');
	}

	if (user && isLoginPage) {
		throw redirect(303, '/modules');
	}

	return resolve(event);
};
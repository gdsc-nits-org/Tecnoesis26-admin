import { redirect, type Handle } from '@sveltejs/kit';
import { getSupabaseServerClient } from '$lib/supabase';

export const handle: Handle = async ({ event, resolve }) => {
	const supabase = getSupabaseServerClient(event.cookies);
	event.locals.supabase = supabase;

	const {
		data: { user }
	} = await supabase.auth.getUser();
	event.locals.user = user;

	const isLoginPage = event.url.pathname.startsWith('/login');

	if (!user && !isLoginPage) {
		throw redirect(303, '/login');
	}

	if (user && isLoginPage) {
		throw redirect(303, '/modules');
	}

	return resolve(event);
};
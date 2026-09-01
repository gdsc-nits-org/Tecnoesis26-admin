import type { Handle } from '@sveltejs/kit';
import { getSupabaseServerClient } from '$lib/supabase';

export const handle: Handle = async ({ event, resolve }) => {
	const supabase = getSupabaseServerClient(event.cookies);

	event.locals.supabase = supabase;
	const {
		data: { user }
	} = await supabase.auth.getUser();
	event.locals.user = user;

	return resolve(event);
};

import { env } from '$env/dynamic/private';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { createServerClient } from '@supabase/ssr';
import type { Cookies } from '@sveltejs/kit';

const getRequiredEnv = (key: string) => {
	const value = env[key];

	if (!value) {
		throw new Error(
			`Missing ${key} environment variable. Add it to your .env file and restart the dev server.`
		);
	}

	return value;
};

export function getSupabaseServerClient(cookies: Cookies): SupabaseClient {
	const url = getRequiredEnv('SUPABASE_URL');
	const publishableKey = env.SUPABASE_PUBLISHABLE_KEY || env.SUPABASE_ANON_KEY;

	if (!publishableKey) {
		throw new Error(
			'Missing SUPABASE_PUBLISHABLE_KEY environment variable. Add it to your .env file and restart the dev server.'
		);
	}

	return createServerClient(url, publishableKey, {
		cookies: {
			getAll: () => cookies.getAll(),
			setAll: (cookieOptions) => {
				cookieOptions.forEach(({ name, value, options }) => {
					cookies.set(name, value, {
						...options,
						path: options?.path ?? '/'
					});
				});
			}
		}
	});
}

export function getSupabaseAdminClient(): SupabaseClient {
	const url = getRequiredEnv('SUPABASE_URL');
	const serviceRoleKey = getRequiredEnv('SUPABASE_SERVICE_ROLE_KEY');

	return createClient(url, serviceRoleKey, {
		auth: {
			persistSession: false,
			autoRefreshToken: false
		},
		global: {
			headers: {
				'x-application-name': 'tecnoesis26-admin'
			}
		}
	});
}

export async function getAuthenticatedUser(cookies: Cookies) {
	const supabase = getSupabaseServerClient(cookies);
	const { data, error } = await supabase.auth.getUser();

	return { user: data.user, error };
}

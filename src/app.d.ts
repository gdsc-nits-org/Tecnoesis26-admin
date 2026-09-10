// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		interface Locals {
			supabase: ReturnType<typeof import('$lib/supabase').getSupabaseServerClient>;
			user:
				| Awaited<
						ReturnType<(typeof import('@supabase/supabase-js').AuthClient)['getUser']>
				  >['data']['user']
				| null;
		}
		// interface Error {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};

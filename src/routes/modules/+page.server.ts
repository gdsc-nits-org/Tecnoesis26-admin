import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { getSupabaseAdminClient } from '$lib/supabase';

export const load: PageServerLoad = async ({ locals }) => {
	const supabase = getSupabaseAdminClient();
	const { data: allModules, error: moduleError } = await supabase
		.from('modules')
		.select('*')
		.order('created_at', { ascending: false });

	if (moduleError) {
		console.error('Supabase Error:', moduleError);
		throw error(500, 'Failed to load modules.');
	}

	if (locals.user?.role === 'super_admin') return { modules: allModules ?? [] };

	const email = locals.user?.email?.trim().toLowerCase();
	if (!email) throw error(401, 'You must be signed in.');

	const { data: assignedEvents, error: eventError } = await supabase
		.from('events')
		.select('module_id')
		.ilike('email', email);

	if (eventError) {
		console.error('Event access lookup failed:', eventError);
		throw error(500, 'Failed to load assigned events.');
	}

	const eventModuleIds = new Set((assignedEvents ?? []).map((event) => event.module_id));
	const modules = (allModules ?? []).filter(
		(module) => module.email?.trim().toLowerCase() === email || eventModuleIds.has(module.module_id)
	);

	return { modules };
};

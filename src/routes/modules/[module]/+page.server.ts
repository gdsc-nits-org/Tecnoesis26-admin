import type { Actions, PageServerLoad } from './$types';
import { error, redirect } from '@sveltejs/kit';
import { requireModuleAccess, requireSuperAdmin } from '$lib/server/admin';

export const load: PageServerLoad = async ({ params, locals }) => {
	const {
		supabase,
		module: moduleData,
		isSuperAdmin,
		hasModuleAccess,
		email
	} = await requireModuleAccess(locals, params.module);

	const { data: events, error: eventsError } = await supabase
		.from('events')
		.select('*')
		.eq('module_id', params.module)
		.order('created_at', { ascending: false });

	if (eventsError) {
		console.error('Event lookup failed:', eventsError);
		throw error(500, 'Failed to load module events.');
	}

	const visibleEvents =
		isSuperAdmin || hasModuleAccess
			? (events ?? [])
			: (events ?? []).filter((event) => event.email?.trim().toLowerCase() === email);

	return {
		module: moduleData,
		events: visibleEvents,
		isSuperAdmin,
		hasModuleAccess
	};
};

export const actions: Actions = {
	deleteModule: async ({ params, locals }) => {
		const { supabase } = await requireSuperAdmin(locals);
		const moduleId = params.module;

		// Delete all events in module first to avoid FK constraint errors
		await supabase.from('events').delete().eq('module_id', moduleId);

		const { error: dbError } = await supabase.from('modules').delete().eq('module_id', moduleId);

		if (dbError) {
			console.error('Delete module error:', dbError);
			throw error(500, 'Failed to delete module.');
		}

		throw redirect(303, '/modules');
	}
};

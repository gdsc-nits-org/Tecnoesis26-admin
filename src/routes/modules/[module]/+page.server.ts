import type { Actions, PageServerLoad } from './$types';
import { getSupabaseAdminClient } from '$lib/supabase';
import { error, redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
	const supabase = getSupabaseAdminClient();
	const moduleId = params.module;

	const { data: moduleData, error: moduleError } = await supabase
		.from('modules')
		.select('*')
		.eq('id', moduleId)
		.single();

	if (moduleError || !moduleData) {
		throw error(404, 'Module not found.');
	}

	const { data: events } = await supabase
		.from('events')
		.select('*')
		.eq('module_id', moduleId);

	return {
		module: moduleData,
		events: events ?? []
	};
};

export const actions: Actions = {
	deleteModule: async ({ params }) => {
		const supabase = getSupabaseAdminClient();
		const moduleId = params.module;

		// Delete all events in module first to avoid FK constraint errors
		await supabase.from('events').delete().eq('module_id', moduleId);

		const { error: dbError } = await supabase
			.from('modules')
			.delete()
			.eq('id', moduleId);

		if (dbError) {
			console.error('Delete module error:', dbError);
			throw error(500, 'Failed to delete module.');
		}

		throw redirect(303, '/modules');
	}
};
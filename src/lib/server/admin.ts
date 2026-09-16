import { getSupabaseAdminClient } from '$lib/supabase';
import { error } from '@sveltejs/kit';

export type AdminRole = 'admin' | 'super_admin';

export function normalizeAdminRole(role: unknown): AdminRole | null {
	const normalized = String(role ?? '').trim().toLowerCase().replace(/[ -]/g, '_');
	if (normalized === 'superadmin' || normalized === 'super_admin') return 'super_admin';
	if (normalized === 'admin') return 'admin';
	return null;
}

export async function findAdminByEmail(email: string) {
	const normalizedEmail = email.trim().toLowerCase();
	const supabase = getSupabaseAdminClient();
	const { data, error } = await supabase
		.from('admins')
		.select('email, role')
		.ilike('email', normalizedEmail)
		.maybeSingle();

	if (error) {
		return { admin: null, error };
	}

	if (!data) return { admin: null, error: null };

	const role = normalizeAdminRole(data.role);
	return { admin: role ? { email: data.email, role } : null, error: null };
}

export async function requireSuperAdmin(locals: App.Locals) {
	if (!locals.user) throw error(401, 'You must be signed in.');
	if (locals.user?.role !== 'super_admin') {
		throw error(403, 'Only super admins can manage modules.');
	}

	return { supabase: getSupabaseAdminClient(), email: locals.user.email?.trim().toLowerCase() ?? '' };
}

export async function requireModuleAccess(locals: App.Locals, moduleId: string) {
	if (!locals.user) throw error(401, 'You must be signed in.');
	const isSuperAdmin = locals.user.role === 'super_admin';
	const email = locals.user.email?.trim().toLowerCase();

	if (!isSuperAdmin && !email) throw error(401, 'You must be signed in.');

	const supabase = getSupabaseAdminClient();
	const { data: moduleData, error: moduleError } = await supabase
		.from('modules')
		.select('*')
		.eq('module_id', moduleId)
		.maybeSingle();

	if (moduleError) {
		console.error('Module lookup failed:', moduleError);
		throw error(500, 'Failed to load module.');
	}

	if (!moduleData) throw error(404, 'Module not found.');

	const hasModuleAccess = isSuperAdmin || moduleData.email?.trim().toLowerCase() === email;
	let hasEventAccess = false;

	if (!hasModuleAccess) {
		const { data: assignedEvent, error: eventError } = await supabase
			.from('events')
			.select('id')
			.eq('module_id', moduleId)
			.ilike('email', email as string)
			.limit(1)
			.maybeSingle();

		if (eventError) {
			console.error('Event access lookup failed:', eventError);
			throw error(500, 'Failed to verify module access.');
		}
		hasEventAccess = Boolean(assignedEvent);
	}

	if (!hasModuleAccess && !hasEventAccess) throw error(403, 'You are not authorized to access this module.');

	return { supabase, module: moduleData, isSuperAdmin, email, hasModuleAccess };
}

export async function requireEventAccess(locals: App.Locals, moduleId: string, eventId: string) {
	const access = await requireModuleAccess(locals, moduleId);
	let { data: event, error: eventError } = await access.supabase
		.from('events')
		.select('*')
		.eq('event_id', eventId)
		.eq('module_id', moduleId)
		.maybeSingle();

	if (!event && !eventError) {
		const fallback = await access.supabase
			.from('events')
			.select('*')
			.eq('id', eventId)
			.eq('module_id', moduleId)
			.maybeSingle();
		event = fallback.data;
		eventError = fallback.error;
	}

	if (eventError) {
		console.error('Event lookup failed:', eventError);
		throw error(500, 'Failed to load event.');
	}
	if (!event) throw error(404, 'Event not found.');

	const hasEventAccess = access.isSuperAdmin || access.hasModuleAccess || event.email?.trim().toLowerCase() === access.email;
	if (!hasEventAccess) throw error(403, 'You are not authorized to access this event.');

	return { ...access, event };
}

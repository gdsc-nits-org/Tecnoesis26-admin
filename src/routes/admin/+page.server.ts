import { fail, error } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { getSupabaseAdminClient } from '$lib/supabase';

type AdminRole = 'admin' | 'super_admin';

const getAuthorizedAdminClient = async (locals: App.Locals) => {
	const email = locals.user?.email?.trim().toLowerCase();

	if (!email) {
		throw error(401, 'You must be signed in.');
	}

	const supabase = getSupabaseAdminClient();
	const { data: currentAdmin, error: lookupError } = await supabase
		.from('admins')
		.select('role')
		.ilike('email', email)
		.maybeSingle();

	if (lookupError) {
		console.error('Admin authorization lookup failed:', lookupError);
		throw error(500, 'Unable to verify admin permissions.');
	}

	if (currentAdmin?.role !== 'super_admin') {
		throw error(403, 'Only super admins can manage admin users.');
	}

	return { supabase, email };
};

export const load: PageServerLoad = async ({ locals }) => {
	const { supabase } = await getAuthorizedAdminClient(locals);
	const { data: admins, error: queryError } = await supabase
		.from('admins')
		.select('email, role')
		.order('email');

	if (queryError) {
		console.error('Admin list query failed:', queryError);
		throw error(500, 'Failed to load admin users.');
	}

	return { admins: admins ?? [] };
};

export const actions: Actions = {
	addAdmin: async ({ request, locals }) => {
		const { supabase } = await getAuthorizedAdminClient(locals);
		const formData = await request.formData();
		const email = String(formData.get('email') ?? '').trim().toLowerCase();
		const role = String(formData.get('role') ?? 'admin') as AdminRole;

		if (!email || !email.includes('@')) {
			return fail(400, { error: 'A valid email address is required.' });
		}

		if (role !== 'admin' && role !== 'super_admin') {
			return fail(400, { error: 'Invalid admin role.' });
		}

		const { error: insertError } = await supabase.from('admins').insert({ email, role });

		if (insertError) {
			console.error('Admin insert failed:', insertError);
			return fail(insertError.code === '23505' ? 409 : 500, {
				error: insertError.code === '23505' ? 'This email is already an admin.' : 'Failed to add admin.'
			});
		}

		return { success: 'Admin added successfully.' };
	},

	removeAdmin: async ({ request, locals }) => {
		const { supabase, email: currentEmail } = await getAuthorizedAdminClient(locals);
		const formData = await request.formData();
		const email = String(formData.get('email') ?? '').trim().toLowerCase();

		if (!email || email === currentEmail) {
			return fail(400, { error: 'You cannot remove your own admin access.' });
		}

		const { error: deleteError } = await supabase.from('admins').delete().ilike('email', email);

		if (deleteError) {
			console.error('Admin delete failed:', deleteError);
			return fail(500, { error: 'Failed to remove admin.' });
		}

		return { success: 'Admin removed successfully.' };
	},

	updateRole: async ({ request, locals }) => {
		const { supabase, email: currentEmail } = await getAuthorizedAdminClient(locals);
		const formData = await request.formData();
		const email = String(formData.get('email') ?? '').trim().toLowerCase();
		const role = String(formData.get('role') ?? '') as AdminRole;

		if (!email || email === currentEmail) {
			return fail(400, { error: 'You cannot change your own admin role.' });
		}

		if (role !== 'admin' && role !== 'super_admin') {
			return fail(400, { error: 'Invalid admin role.' });
		}

		const { data: targetAdmin, error: targetError } = await supabase
			.from('admins')
			.select('email')
			.ilike('email', email)
			.maybeSingle();

		if (targetError) {
			console.error('Admin role target lookup failed:', targetError);
			return fail(500, { error: 'Failed to verify the selected admin.' });
		}

		if (!targetAdmin) {
			return fail(404, { error: 'Admin user was not found.' });
		}

		const { error: updateError } = await supabase
			.from('admins')
			.update({ role })
			.ilike('email', email);

		if (updateError) {
			console.error('Admin role update failed:', updateError);
			return fail(500, { error: 'Failed to update admin role.' });
		}

		return { success: 'Admin role updated successfully.' };
	}
};
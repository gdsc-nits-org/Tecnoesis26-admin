import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ cookies }) => {
	const devRole = cookies.get('dev_role') || 'admin';
	return {
		user: {
			id: '1',
			email: devRole === 'super_admin' ? 'superadmin@tecnoesis.club' : 'admin@tecnoesis.club',
			name: 'tecno.dev',
			role: devRole
		}
	};
};

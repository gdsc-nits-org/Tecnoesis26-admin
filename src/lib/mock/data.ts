// 'super_admin' or 'admin'
export const mockUser = {
	id: 'usr-001',
	name: 'tecno.dev',
	email: 'superadmin@tecnoesis.club',
	role: 'super_admin' as 'super_admin' | 'admin'   // ← change this value to test
};

export const mockAdminUsers = [
	{
		id: 'usr-001',
		email: 'superadmin@tecnoesis.club',
		role: 'super_admin' as 'super_admin' | 'admin',
		createdAt: '2025-01-01'
	},
	{
		id: 'usr-002',
		email: 'alice.admin@tecnoesis.club',
		role: 'admin' as 'super_admin' | 'admin',
		assignedEventIds: [1, 2],
		createdAt: '2025-01-10'
	},
	{
		id: 'usr-003',
		email: 'bob.admin@tecnoesis.club',
		role: 'admin' as 'super_admin' | 'admin',
		assignedEventIds: [3],
		createdAt: '2025-01-15'
	}
];

export const mockMerchOrders = [
	{
		id: 'ord-001',
		type: 'Tecnoesis',
		size: 'L',
		quantity: 1,
		createdAt: '2025-02-10',
		user: {
			firstName: 'Alice',
			lastName: 'Roy',
			email: 'alice@nits.ac.in',
			username: 'alice',
			phoneNumber: '9876543210',
			registrationId: '2212001',
			collegeName: 'NIT Silchar'
		}
	},
	{
		id: 'ord-002',
		type: 'Spark',
		size: 'M',
		quantity: 1,
		createdAt: '2025-02-11',
		user: {
			firstName: 'Bob',
			lastName: 'Das',
			email: 'bob@nits.ac.in',
			username: 'bob',
			phoneNumber: '9876543211',
			registrationId: '2212002',
			collegeName: 'NIT Silchar'
		}
	},
	{
		id: 'ord-003',
		type: 'Tecnoesis',
		size: 'XL',
		quantity: 1,
		createdAt: '2025-02-12',
		user: {
			firstName: 'Eve',
			lastName: 'Nair',
			email: 'eve@nits.ac.in',
			username: 'eve',
			phoneNumber: '9876543213',
			registrationId: '2212004',
			collegeName: 'NIT Silchar'
		}
	},
	{
		id: 'ord-004',
		type: 'Spark',
		size: 'S',
		quantity: 1,
		createdAt: '2025-02-13',
		user: {
			firstName: 'Frank',
			lastName: 'Bose',
			email: 'frank@nits.ac.in',
			username: 'frank',
			phoneNumber: '9876543214',
			registrationId: '2212005',
			collegeName: 'NIT Silchar'
		}
	}
];

export const mockModules = [
	{
		id: 1,
		name: 'Technical',
		description: 'Coding, hackathons and competitive programming events.',
		iconImage: 'https://picsum.photos/100/100?random=1',
		coverImage: 'https://picsum.photos/800/300?random=1',
		eventCount: 2
	},
	{
		id: 2,
		name: 'Robotics',
		description: 'Hardware, robotics and electronics competitions.',
		iconImage: 'https://picsum.photos/100/100?random=2',
		coverImage: 'https://picsum.photos/800/300?random=2',
		eventCount: 1
	}
];

export const mockEvents = [
	{
		id: 1,
		moduleId: 1,
		name: 'Coding Hackathon',
		venue: 'LHC 101',
		description: 'A 24 hour hackathon open to all branches.',
		maxTeamSize: 4,
		minTeamSize: 2,
		registrationStartTime: '2025-02-01',
		registrationEndTime: '2025-03-01',
		prizeDescription: '₹10,000 cash prize for winners',
		stagesDescription: 'Round 1: Online screening.\nRound 2: Onsite final.',
		posterImage: 'https://picsum.photos/400/200?random=10',
		bannerImage: 'https://picsum.photos/1200/400?random=20',
		documents: [
			{ name: 'rulebook.pdf', url: '#' },
			{ name: 'schedule.pdf', url: '#' }
		]
	},
	{
		id: 2,
		moduleId: 1,
		name: 'Web Dev Contest',
		venue: 'CS Lab 2',
		description: 'Design and build a web app in 6 hours.',
		maxTeamSize: 3,
		minTeamSize: 1,
		registrationStartTime: '2025-02-10',
		registrationEndTime: '2025-03-10',
		prizeDescription: 'Trophy + certificates',
		stagesDescription: 'Single round, 6 hours.',
		posterImage: 'https://picsum.photos/400/200?random=11',
		bannerImage: 'https://picsum.photos/1200/400?random=21',
		documents: []
	},
	{
		id: 3,
		moduleId: 2,
		name: 'Robo Wars',
		venue: 'Sports Complex',
		description: 'Robot combat competition.',
		maxTeamSize: 3,
		minTeamSize: 1,
		registrationStartTime: '2025-02-15',
		registrationEndTime: '2025-03-15',
		prizeDescription: 'Trophy + ₹5,000',
		stagesDescription: 'Single elimination bracket.',
		posterImage: 'https://picsum.photos/400/200?random=12',
		bannerImage: 'https://picsum.photos/1200/400?random=22',
		documents: []
	}
];

export const mockRegistrations = [
	{
		eventId: 1,
		teamName: '404 Coders',
		registrationStatus: 'REGISTERED',
		members: [
			{
				username: 'alice',
				firstName: 'Alice',
				lastName: 'Roy',
				email: 'alice@nits.ac.in',
				phoneNumber: '9876543210',
				collegeName: 'National Institute of Technology, Silchar',
				registrationId: '2212001'
			},
			{
				username: 'bob',
				firstName: 'Bob',
				lastName: 'Das',
				email: 'bob@nits.ac.in',
				phoneNumber: '9876543211',
				collegeName: 'National Institute of Technology, Silchar',
				registrationId: '2212002'
			}
		]
	},
	{
		eventId: 1,
		teamName: 'Debug Squad',
		registrationStatus: 'PENDING',
		members: [
			{
				username: 'dave',
				firstName: 'Dave',
				lastName: 'Sen',
				email: 'dave@nits.ac.in',
				phoneNumber: '9876543212',
				collegeName: 'National Institute of Technology, Silchar',
				registrationId: '2212003'
			}
		]
	},
	{
		eventId: 1,
		teamName: 'Null Pointers',
		registrationStatus: 'REGISTERED',
		members: [
			{
				username: 'eve',
				firstName: 'Eve',
				lastName: 'Nair',
				email: 'eve@nits.ac.in',
				phoneNumber: '9876543213',
				collegeName: 'National Institute of Technology, Silchar',
				registrationId: '2212004'
			},
			{
				username: 'frank',
				firstName: 'Frank',
				lastName: 'Bose',
				email: 'frank@nits.ac.in',
				phoneNumber: '9876543214',
				collegeName: 'National Institute of Technology, Silchar',
				registrationId: '2212005'
			},
			{
				username: 'grace',
				firstName: 'Grace',
				lastName: 'Paul',
				email: 'grace@nits.ac.in',
				phoneNumber: '9876543215',
				collegeName: 'National Institute of Technology, Silchar',
				registrationId: '2212006'
			}
		]
	},
	{
		eventId: 2,
		teamName: 'Pixel Pushers',
		registrationStatus: 'REGISTERED',
		members: [
			{
				username: 'heidi',
				firstName: 'Heidi',
				lastName: 'Gogoi',
				email: 'heidi@nits.ac.in',
				phoneNumber: '9876543216',
				collegeName: 'National Institute of Technology, Silchar',
				registrationId: '2212007'
			}
		]
	},
	{
		eventId: 3,
		teamName: 'Iron Circuit',
		registrationStatus: 'CANCELLED',
		members: [
			{
				username: 'ivan',
				firstName: 'Ivan',
				lastName: 'Baruah',
				email: 'ivan@nits.ac.in',
				phoneNumber: '9876543217',
				collegeName: 'National Institute of Technology, Silchar',
				registrationId: '2212008'
			},
			{
				username: 'judy',
				firstName: 'Judy',
				lastName: 'Kalita',
				email: 'judy@nits.ac.in',
				phoneNumber: '9876543218',
				collegeName: 'National Institute of Technology, Silchar',
				registrationId: '2212009'
			}
		]
	}
];
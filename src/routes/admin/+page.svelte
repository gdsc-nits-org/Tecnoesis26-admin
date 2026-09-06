<script lang="ts">
	import { goto } from '$app/navigation';
	import { mockUser, mockAdminUsers } from '$lib/mock/data';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import {
		Table,
		TableBody,
		TableCell,
		TableHead,
		TableHeader,
		TableRow
	} from '$lib/components/ui/table/index.js';
	import ShieldCheck from '@lucide/svelte/icons/shield-check';
	import Trash2 from '@lucide/svelte/icons/trash-2';
	import Plus from '@lucide/svelte/icons/plus';
	import ChevronLeft from '@lucide/svelte/icons/chevron-left';

	if (mockUser.role !== 'super_admin') goto('/modules');

	let admins = $state([...mockAdminUsers]);
	let newEmail = $state('');
	let newRole = $state<'admin' | 'super_admin'>('admin');
	let adding = $state(false);

	function handleAdd() {
		if (!newEmail) return;
		admins = [
			...admins,
			{
				id: `usr-${Date.now()}`,
				email: newEmail,
				role: newRole,
				createdAt: new Date().toISOString().split('T')[0]
			}
		];
		newEmail = '';
		newRole = 'admin';
		adding = false;
	}

	function handleRemove(id: string) {
		admins = admins.filter((a) => a.id !== id);
	}

	function handleToggleRole(id: string) {
		admins = admins.map((a) =>
			a.id === id
				? { ...a, role: a.role === 'super_admin' ? 'admin' : 'super_admin' as 'admin' | 'super_admin' }
				: a
		);
	}
</script>

<svelte:head>
	<title>Admin Users — Tecnoesis Admin</title>
</svelte:head>

<div class="p-6 mx-auto max-w-7xl">
	<div class="mb-6 flex items-start justify-between">
		<div>
			<Button href="/modules" variant="ghost" size="sm" class="mb-4 gap-1 pl-0">
				<ChevronLeft class="size-4" />
				Back to Modules
			</Button>
			<h1 class="text-2xl font-bold">Admin Users</h1>
			<p class="text-muted-foreground text-sm mt-1">Manage who has access to this admin panel.</p>
		</div>
		<Button size="sm" class="gap-1.5 mt-8" onclick={() => (adding = !adding)}>
			<Plus class="size-3.5" />
			Add Admin
		</Button>
	</div>

	{#if adding}
		<div class="mb-6 rounded-lg border p-4">
			<p class="mb-3 font-medium text-sm">New Admin</p>
			<div class="flex flex-wrap items-end gap-3">
				<div class="space-y-1.5">
					<Label for="email">Email</Label>
					<Input id="email" type="email" bind:value={newEmail} placeholder="admin@tecnoesis.club" class="w-64" />
				</div>
				<div class="space-y-1.5">
					<Label for="role">Role</Label>
					<select
						id="role"
						bind:value={newRole}
						class="border-input flex h-9 rounded-md border bg-transparent px-3 py-1 text-sm shadow-xs"
					>
						<option value="admin">Admin</option>
						<option value="super_admin">Super Admin</option>
					</select>
				</div>
				<Button onclick={handleAdd} disabled={!newEmail} size="sm">Add</Button>
				<Button variant="ghost" size="sm" onclick={() => (adding = false)}>Cancel</Button>
			</div>
		</div>
	{/if}

	<div class="rounded-lg border">
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>Email</TableHead>
					<TableHead>Role</TableHead>
					<TableHead>Added</TableHead>
					<TableHead class="text-right">Actions</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{#each admins as admin}
					<TableRow>
						<TableCell class="font-medium">{admin.email}</TableCell>
						<TableCell>
							<Badge variant={admin.role === 'super_admin' ? 'default' : 'secondary'} class="gap-1">
								{#if admin.role === 'super_admin'}
									<ShieldCheck class="size-3" />
								{/if}
								{admin.role === 'super_admin' ? 'Super Admin' : 'Admin'}
							</Badge>
						</TableCell>
						<TableCell class="text-muted-foreground text-sm">{admin.createdAt}</TableCell>
						<TableCell class="text-right">
							<div class="flex items-center justify-end gap-2">
								{#if admin.id !== mockUser.id}
									<Button
										variant="ghost"
										size="sm"
										onclick={() => handleToggleRole(admin.id)}
										class="text-xs"
									>
										Make {admin.role === 'super_admin' ? 'Admin' : 'Super Admin'}
									</Button>
									<Button
										variant="ghost"
										size="sm"
										onclick={() => handleRemove(admin.id)}
										class="text-destructive hover:text-destructive"
									>
										<Trash2 class="size-3.5" />
									</Button>
								{:else}
									<span class="text-muted-foreground text-xs">You</span>
								{/if}
							</div>
						</TableCell>
					</TableRow>
				{/each}
			</TableBody>
		</Table>
	</div>
</div>
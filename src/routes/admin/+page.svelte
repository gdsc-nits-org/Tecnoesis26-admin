<script lang="ts">
	import { enhance } from '$app/forms';
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

	let { data, form } = $props();
	let newEmail = $state('');
	let newRole = $state<'admin' | 'super_admin'>('admin');
	let adding = $state(false);
	let submitting = $state(false);
	let currentEmail = $derived(data.user?.email?.toLowerCase());
</script>

<svelte:head>
	<title>Admin Users — Tecnoesis Admin</title>
</svelte:head>

<div class="mx-auto max-w-7xl p-6">
	<div class="mb-6 flex items-start justify-between">
		<div>
			<Button href="/modules" variant="ghost" size="sm" class="mb-4 gap-1 pl-0">
				<ChevronLeft class="size-4" />
				Back to Modules
			</Button>
			<h1 class="text-2xl font-bold">Admin Users</h1>
			<p class="mt-1 text-sm text-muted-foreground">Manage who has access to this admin panel.</p>
		</div>
		<Button size="sm" class="mt-8 gap-1.5" onclick={() => (adding = !adding)}>
			<Plus class="size-3.5" />
			Add Admin
		</Button>
	</div>

	{#if form?.error}
		<p class="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{form.error}</p>
	{:else if form?.success}
		<p class="mb-4 rounded-md border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">{form.success}</p>
	{/if}

	{#if adding}
		<div class="mb-6 rounded-lg border p-4">
			<p class="mb-3 text-sm font-medium">New Admin</p>
			<form
				method="POST"
				action="?/addAdmin"
				class="flex flex-wrap items-end gap-3"
				use:enhance={() => {
					submitting = true;
					return async ({ update }) => {
						await update();
						submitting = false;
					};
				}}
			>
				<div class="space-y-1.5">
					<Label for="email">Email</Label>
					<Input id="email" name="email" type="email" bind:value={newEmail} placeholder="admin@tecnoesis.club" class="w-64" required />
				</div>
				<div class="space-y-1.5">
					<Label for="role">Role</Label>
					<select id="role" name="role" bind:value={newRole} class="flex h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs">
						<option value="admin">Admin</option>
						<option value="super_admin">Super Admin</option>
					</select>
				</div>
				<Button type="submit" disabled={submitting} size="sm">{submitting ? 'Adding...' : 'Add'}</Button>
				<Button type="button" variant="ghost" size="sm" onclick={() => (adding = false)}>Cancel</Button>
			</form>
		</div>
	{/if}

	<div class="rounded-lg border">
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>Email</TableHead>
					<TableHead>Role</TableHead>
					<TableHead class="text-right">Actions</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{#each data.admins as admin (admin.email)}
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
						<TableCell class="text-right">
							{#if admin.email.toLowerCase() === currentEmail}
								<span class="text-xs text-muted-foreground">You</span>
							{:else}
								<div class="flex items-center justify-end gap-2">
									<form method="POST" action="?/updateRole" use:enhance>
										<input type="hidden" name="email" value={admin.email} />
										<input
											type="hidden"
											name="role"
											value={admin.role === 'super_admin' ? 'admin' : 'super_admin'}
										/>
										<Button type="submit" variant="ghost" size="sm" class="text-xs">
											Make {admin.role === 'super_admin' ? 'Admin' : 'Super Admin'}
										</Button>
									</form>
									<form method="POST" action="?/removeAdmin" use:enhance>
										<input type="hidden" name="email" value={admin.email} />
										<Button type="submit" variant="ghost" size="sm" class="text-destructive hover:text-destructive">
											<Trash2 class="size-3.5" />
										</Button>
									</form>
								</div>
							{/if}
						</TableCell>
					</TableRow>
				{/each}
			</TableBody>
		</Table>
	</div>
</div>

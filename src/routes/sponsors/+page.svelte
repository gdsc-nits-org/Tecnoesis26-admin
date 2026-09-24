<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
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
	import ChevronLeft from '@lucide/svelte/icons/chevron-left';
	import Pencil from '@lucide/svelte/icons/pencil';
	import Plus from '@lucide/svelte/icons/plus';
	import Trash2 from '@lucide/svelte/icons/trash-2';
	import Upload from '@lucide/svelte/icons/upload';

	let { data, form } = $props();
	let adding = $state(false);
	let editingId = $state<string | null>(null);
	let submitting = $state(false);
	let isSuperAdmin = $derived($page.data.user?.role === 'super_admin');
</script>

<svelte:head>
	<title>Sponsors - Tecnoesis Admin</title>
</svelte:head>

<div class="mx-auto max-w-7xl p-6">
	<div class="mb-6 flex items-start justify-between">
		<div>
			<Button href="/merch" variant="ghost" size="sm" class="mb-4 gap-1 pl-0">
				<ChevronLeft class="size-4" />
				Back to Merch
			</Button>
			<h1 class="text-2xl font-bold">Sponsors</h1>
			<p class="mt-1 text-sm text-muted-foreground">Manage event sponsors and their logos.</p>
		</div>
		<Button size="sm" class="mt-8 gap-1.5" onclick={() => (adding = !adding)}>
			<Plus class="size-3.5" />
			Add Sponsor
		</Button>
	</div>

	{#if form?.error}
		<p class="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
			{form.error}
		</p>
	{:else if form?.success}
		<p class="mb-4 rounded-md border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">
			{form.success}
		</p>
	{/if}

	{#if adding}
		<div class="mb-6 rounded-lg border p-4">
			<p class="mb-3 text-sm font-medium">New Sponsor</p>
			<form
				method="POST"
				action="?/addSponsor"
				enctype="multipart/form-data"
				class="flex flex-wrap items-end gap-3"
				use:enhance={() => {
					submitting = true;
					return async ({ update }) => {
						await update();
						submitting = false;
						if (!form?.error) adding = false;
					};
				}}
			>
				<div class="space-y-1.5">
					<Label for="sponsorName">Name</Label>
					<Input id="sponsorName" name="sponsorName" required class="w-64" />
				</div>
				<div class="space-y-1.5">
					<Label for="sponsorImg">Logo</Label>
					<Input
						id="sponsorImg"
						name="sponsorImg"
						type="file"
						accept="image/*"
						required
						class="bg-white"
					/>
				</div>
				<Button type="submit" disabled={submitting} size="sm">
					<Upload class="size-3.5" />
					{submitting ? 'Adding...' : 'Add'}
				</Button>
				<Button type="button" variant="ghost" size="sm" onclick={() => (adding = false)}
					>Cancel</Button
				>
			</form>
		</div>
	{/if}

	{#if data.sponsors.length === 0}
		<div class="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
			No sponsors added yet.
		</div>
	{:else}
		<div class="rounded-lg border">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Sponsor</TableHead>
						<TableHead>Logo</TableHead>
						<TableHead>Added</TableHead>
						{#if isSuperAdmin}<TableHead class="text-right">Actions</TableHead>{/if}
					</TableRow>
				</TableHeader>
				<TableBody>
					{#each data.sponsors as sponsor (sponsor.id)}
						<TableRow>
							{#if editingId === sponsor.id}
								<TableCell colspan={isSuperAdmin ? 4 : 3}>
									<form
										method="POST"
										action="?/editSponsor"
										enctype="multipart/form-data"
										class="flex flex-wrap items-end gap-3"
										use:enhance
									>
										<input type="hidden" name="id" value={sponsor.id} />
										<div class="space-y-1.5">
											<Label for="edit-name-{sponsor.id}">Name</Label><Input
												id="edit-name-{sponsor.id}"
												name="sponsorName"
												value={sponsor.sponsor_name}
												required
											/>
										</div>
										<div class="space-y-1.5">
											<Label for="edit-img-{sponsor.id}">Replace logo</Label><Input
												id="edit-img-{sponsor.id}"
												name="sponsorImg"
												type="file"
												accept="image/*"
												class="bg-white"
											/>
										</div>
										<Button type="submit" size="sm">Save</Button>
										<Button
											type="button"
											variant="ghost"
											size="sm"
											onclick={() => (editingId = null)}>Cancel</Button
										>
									</form>
								</TableCell>
							{:else}
								<TableCell class="font-medium">{sponsor.sponsor_name}</TableCell>
								<TableCell
									><img
										src={sponsor.sponsor_img}
										alt={sponsor.sponsor_name}
										class="h-12 w-28 rounded border object-contain"
									/></TableCell
								>
								<TableCell class="text-sm text-muted-foreground"
									>{new Date(sponsor.created_at).toLocaleDateString('en-IN')}</TableCell
								>
								{#if isSuperAdmin}
									<TableCell class="text-right">
										<div class="flex justify-end gap-2">
											<Button variant="ghost" size="sm" onclick={() => (editingId = sponsor.id)}
												><Pencil class="size-3.5" /></Button
											>
											<form method="POST" action="?/deleteSponsor" use:enhance>
												<input type="hidden" name="id" value={sponsor.id} />
												<Button
													type="submit"
													variant="ghost"
													size="sm"
													class="text-destructive hover:text-destructive"
													onclick={(event) => {
														if (!confirm(`Delete ${sponsor.sponsor_name}?`)) event.preventDefault();
													}}><Trash2 class="size-3.5" /></Button
												>
											</form>
										</div>
									</TableCell>
								{/if}
							{/if}
						</TableRow>
					{/each}
				</TableBody>
			</Table>
		</div>
	{/if}
</div>

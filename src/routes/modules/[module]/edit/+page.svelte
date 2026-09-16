<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Textarea } from '$lib/components/ui/textarea/index.js';
	import ChevronLeft from '@lucide/svelte/icons/chevron-left';

	let { data, form } = $props();
	let module = $derived(data.module);
	let moduleId = $derived($page.params.module);
	let saving = $state(false);
</script>

<svelte:head>
	<title>Edit {module.name} - Tecnoesis Admin</title>
</svelte:head>

<div class="mb-6">
	<Button href="/modules/{moduleId}" variant="ghost" size="sm" class="mb-4 gap-1 pl-0">
		<ChevronLeft class="size-4" />
		Back to Module
	</Button>
	<h1 class="text-2xl font-bold">Edit Module</h1>
	<p class="text-sm text-muted-foreground">Update module ownership, routing, and permissions.</p>
</div>

<form
	method="POST"
	action="?/updateDetails"
	class="max-w-2xl space-y-5"
	use:enhance={() => {
		saving = true;
		return async ({ update }) => {
			await update();
			saving = false;
		};
	}}
>
	{#if form?.error}
		<div class="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">{form.error}</div>
	{/if}
	{#if form?.success}
		<div class="rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-700">Saved successfully.</div>
	{/if}

	<div class="space-y-1.5">
		<Label for="name">Module Name *</Label>
		<Input id="name" name="name" value={module.name} required />
	</div>
	<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
		<div class="space-y-1.5">
			<Label for="moduleId">Route Name *</Label>
			<Input id="moduleId" name="moduleId" value={module.module_id} pattern="[a-z0-9-]+" required />
		</div>
		<div class="space-y-1.5">
			<Label for="email">Assigned Admin Email *</Label>
			<Input id="email" name="email" type="email" value={module.email} required />
		</div>
	</div>
	<div class="space-y-1.5">
		<Label for="description">Description</Label>
		<Textarea id="description" name="description" value={module.description} rows={4} />
	</div>
	<div class="space-y-1.5">
		<Label for="thirdPartyUrl">Third Party URL</Label>
		<Input id="thirdPartyUrl" name="thirdPartyUrl" value={module.third_party_url} placeholder="https://..." />
	</div>
	<div class="space-y-3 rounded-lg border p-4">
		<label class="flex items-center gap-2 text-sm">
			<input type="checkbox" name="adminEditable" checked={module.admin_editable === true} />
			Allow the assigned admin to edit this module
		</label>
		<label class="flex items-center gap-2 text-sm">
			<input type="checkbox" name="canCreateEvents" checked={module.can_create_events === true} />
			Allow the assigned admin to create events
		</label>
	</div>
	<Button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</Button>
</form>

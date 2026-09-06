<script lang="ts">
	import { goto } from '$app/navigation';
	import { mockUser } from '$lib/mock/data';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Textarea } from '$lib/components/ui/textarea/index.js';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import ChevronLeft from '@lucide/svelte/icons/chevron-left';

	if (mockUser.role !== 'super_admin') goto('/modules');

	let name = $state('');
	let description = $state('');
	let iconImage = $state('');
	let coverImage = $state('');
	let thirdPartyUrl = $state('');
	let submitting = $state(false);

	function handleCreate() {
		submitting = true;
		console.log('create module', { name, description, iconImage, coverImage, thirdPartyUrl });
		goto('/modules');
	}
</script>

<svelte:head>
	<title>Create Module — Tecnoesis Admin</title>
</svelte:head>

<div class="mb-6">
	<Button href="/modules" variant="ghost" size="sm" class="mb-4 gap-1 pl-0">
		<ChevronLeft class="size-4" />
		All Modules
	</Button>
	<h1 class="text-2xl font-bold">Create Module</h1>
	<p class="text-muted-foreground text-sm">Add a new module to Tecnoesis.</p>
</div>

<div class="max-w-2xl space-y-5">
	<div class="space-y-1.5">
		<Label for="name">Module Name</Label>
		<Input id="name" bind:value={name} placeholder="e.g. Technical" />
	</div>

	<div class="space-y-1.5">
		<Label for="description">Description</Label>
		<Textarea id="description" bind:value={description} rows={3} placeholder="What does this module cover?" />
	</div>

	<div class="space-y-1.5">
		<Label for="icon">Icon Image URL</Label>
		<Input id="icon" bind:value={iconImage} placeholder="https://..." />
		{#if iconImage}
			<img src={iconImage} alt="Icon preview" class="mt-2 size-16 rounded-lg object-cover border" />
		{/if}
	</div>

	<div class="space-y-1.5">
		<Label for="cover">Cover Image URL</Label>
		<Input id="cover" bind:value={coverImage} placeholder="https://..." />
		{#if coverImage}
			<img src={coverImage} alt="Cover preview" class="mt-2 h-28 w-full rounded-lg object-cover border" />
		{/if}
	</div>

	<div class="space-y-1.5">
		<Label for="url">Third Party URL <span class="text-muted-foreground">(optional)</span></Label>
		<Input id="url" bind:value={thirdPartyUrl} placeholder="https://..." />
	</div>

	<Separator />
	<Button onclick={handleCreate} disabled={submitting || !name}>
		Create Module
	</Button>
</div>
<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { mockModules } from '$lib/mock/data';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Textarea } from '$lib/components/ui/textarea/index.js';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import ChevronLeft from '@lucide/svelte/icons/chevron-left';

	const moduleId = Number($page.params.module);

	let selectedModuleId = $state(moduleId);
	let name = $state('');
	let description = $state('');
	let venue = $state('');
	let minTeamSize = $state(1);
	let maxTeamSize = $state(4);
	let registrationEndTime = $state('');
	let prizeDescription = $state('');
	let stagesDescription = $state('');
	let submitting = $state(false);

	function handleCreate() {
		submitting = true;
		console.log('creating event...', {
			moduleId: selectedModuleId,
			name, description, venue,
			minTeamSize, maxTeamSize,
			registrationEndTime, prizeDescription, stagesDescription
		});
		goto(`/modules/${selectedModuleId}`);
	}
</script>

<svelte:head>
	<title>Create Event — Tecnoesis Admin</title>
</svelte:head>

<div class="mb-6">
	<Button href="/modules/{moduleId}" variant="ghost" size="sm" class="mb-4 gap-1 pl-0">
		<ChevronLeft class="size-4" />
		Back to Module
	</Button>
	<h1 class="text-2xl font-bold">Create Event</h1>
	<p class="text-muted-foreground text-sm">Set up a new event and its details.</p>
</div>

<div class="max-w-2xl space-y-5">
	<div class="space-y-1.5">
		<Label for="module">Module</Label>
		<select
			id="module"
			bind:value={selectedModuleId}
			class="border-input flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-xs"
		>
			{#each mockModules as m}
				<option value={m.id}>{m.name}</option>
			{/each}
		</select>
	</div>

	<div class="space-y-1.5">
		<Label for="name">Event Name</Label>
		<Input id="name" bind:value={name} placeholder="e.g. Coding Hackathon" />
	</div>

	<div class="space-y-1.5">
		<Label for="description">Description</Label>
		<Textarea id="description" bind:value={description} rows={4} placeholder="What's this event about?" />
	</div>

	<div class="space-y-1.5">
		<Label for="venue">Venue</Label>
		<Input id="venue" bind:value={venue} placeholder="e.g. LHC 101" />
	</div>

	<div class="grid grid-cols-2 gap-4">
		<div class="space-y-1.5">
			<Label for="min">Min Team Size</Label>
			<Input id="min" type="number" bind:value={minTeamSize} min={1} />
		</div>
		<div class="space-y-1.5">
			<Label for="max">Max Team Size</Label>
			<Input id="max" type="number" bind:value={maxTeamSize} min={1} />
		</div>
	</div>

	<div class="space-y-1.5">
		<Label for="reg-end">Registration Close Date</Label>
		<Input id="reg-end" type="date" bind:value={registrationEndTime} />
	</div>

	<div class="space-y-1.5">
		<Label for="prize">Prize Description</Label>
		<Textarea id="prize" bind:value={prizeDescription} rows={2} placeholder="Optional" />
	</div>

	<div class="space-y-1.5">
		<Label for="stages">Stages Description</Label>
		<Textarea id="stages" bind:value={stagesDescription} rows={3} placeholder="Optional" />
	</div>

	<Separator />
	<Button onclick={handleCreate} disabled={submitting || !name || !venue}>
		Create Event
	</Button>
</div>
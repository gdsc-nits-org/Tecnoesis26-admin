<script lang="ts">
	import { page } from '$app/stores';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Textarea } from '$lib/components/ui/textarea/index.js';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import ChevronLeft from '@lucide/svelte/icons/chevron-left';
	import { enhance } from '$app/forms';

	let { form } = $props();
	let moduleId = $derived($page.params.module);
	let submitting = $state(false);
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
	<p class="text-sm text-muted-foreground">Set up a new event and its details.</p>
</div>

<!-- 
  enctype="multipart/form-data" is required for file uploads to work!
-->
<form
	method="POST"
	action="?/create"
	enctype="multipart/form-data"
	class="max-w-2xl space-y-5"
	use:enhance={() => {
		submitting = true;
		return async ({ update }) => {
			await update();
			submitting = false;
		};
	}}
>
	{#if form?.error}
		<div class="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
			{form.error}
		</div>
	{/if}

	<div class="space-y-1.5">
		<Label for="name">Event Name *</Label>
		<Input id="name" name="name" required placeholder="e.g. Coding Hackathon" />
	</div>

	<div class="space-y-1.5">
		<Label for="description">Description</Label>
		<Textarea id="description" name="description" rows={4} placeholder="What's this event about?" />
	</div>

	<div class="space-y-1.5">
		<Label for="venue">Venue *</Label>
		<Input id="venue" name="venue" required placeholder="e.g. LHC 101" />
	</div>

	<div class="grid grid-cols-2 gap-4">
		<div class="space-y-1.5">
			<Label for="minTeamSize">Min Team Size</Label>
			<Input id="minTeamSize" name="minTeamSize" type="number" value="1" min="1" />
		</div>
		<div class="space-y-1.5">
			<Label for="maxTeamSize">Max Team Size</Label>
			<Input id="maxTeamSize" name="maxTeamSize" type="number" value="4" min="1" />
		</div>
	</div>

	<div class="space-y-1.5">
		<Label for="registrationEndTime">Registration Close Date *</Label>
		<Input id="registrationEndTime" name="registrationEndTime" type="date" required />
	</div>

	<!-- New Image Upload Fields -->
	<div class="grid grid-cols-2 gap-4 rounded-lg border bg-muted/20 p-4">
		<div class="space-y-1.5">
			<Label for="poster">Poster Image</Label>
			<Input id="poster" name="poster" type="file" accept="image/*" class="bg-white" />
		</div>
		<div class="space-y-1.5">
			<Label for="banner">Banner Image</Label>
			<Input id="banner" name="banner" type="file" accept="image/*" class="bg-white" />
		</div>
	</div>

	<div class="space-y-1.5">
		<Label for="prizeDescription">Prize Description</Label>
		<Textarea id="prizeDescription" name="prizeDescription" rows={2} placeholder="Optional" />
	</div>

	<div class="space-y-1.5">
		<Label for="stagesDescription">Stages Description</Label>
		<Textarea id="stagesDescription" name="stagesDescription" rows={3} placeholder="Optional" />
	</div>

	<Separator />
	<Button type="submit" disabled={submitting}>
		{submitting ? 'Creating Event...' : 'Create Event'}
	</Button>
</form>

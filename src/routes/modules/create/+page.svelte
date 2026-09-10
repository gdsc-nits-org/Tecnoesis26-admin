<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Textarea } from '$lib/components/ui/textarea/index.js';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import ChevronLeft from '@lucide/svelte/icons/chevron-left';
	import ImageIcon from '@lucide/svelte/icons/image';
	import { enhance } from '$app/forms';

	let { form } = $props();

	let coverPreview = $state<string | null>(null);
	let submitting = $state(false);

	function previewFile(e: Event) {
		const input = e.currentTarget as HTMLInputElement;
		const file = input.files?.[0];
		if (!file) return;
		const reader = new FileReader();
		reader.onload = () => {
			coverPreview = reader.result as string;
		};
		reader.readAsDataURL(file);
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
	<p class="text-sm text-muted-foreground">Add a new module to Tecnoesis.</p>
</div>

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
		<Label for="name">Module Name *</Label>
		<Input id="name" name="name" required placeholder="e.g. Technical" />
	</div>

	<div class="space-y-1.5">
		<Label for="description">Description</Label>
		<Textarea
			id="description"
			name="description"
			rows={3}
			placeholder="What does this module cover?"
		/>
	</div>

	<!-- Cover Image Upload -->
	<div class="space-y-1.5">
		<Label for="coverImage">Cover Image</Label>
		<div class="overflow-hidden rounded-lg border bg-muted/20">
			{#if coverPreview}
				<img src={coverPreview} alt="Cover preview" class="h-40 w-full object-cover" />
			{:else}
				<div
					class="flex h-40 w-full flex-col items-center justify-center gap-2 text-muted-foreground"
				>
					<ImageIcon class="size-8" />
					<p class="text-xs">No cover image selected</p>
				</div>
			{/if}
		</div>
		<Input
			id="coverImage"
			name="coverImage"
			type="file"
			accept="image/*"
			class="bg-white"
			onchange={previewFile}
		/>
	</div>

	<div class="space-y-1.5">
		<Label for="thirdPartyUrl">
			Third Party URL
			<span class="text-muted-foreground">(optional)</span>
		</Label>
		<Input id="thirdPartyUrl" name="thirdPartyUrl" placeholder="https://..." />
	</div>

	<Separator />

	<Button type="submit" disabled={submitting}>
		{submitting ? 'Creating...' : 'Create Module'}
	</Button>
</form>
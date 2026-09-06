<script lang="ts">
	import { page } from '$app/stores';
	import { mockEvents } from '$lib/mock/data';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Textarea } from '$lib/components/ui/textarea/index.js';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import { Tabs, TabsContent, TabsList, TabsTrigger } from '$lib/components/ui/tabs/index.js';
	import ChevronLeft from '@lucide/svelte/icons/chevron-left';
	import Upload from '@lucide/svelte/icons/upload';
	import Trash2 from '@lucide/svelte/icons/trash-2';
	import FileText from '@lucide/svelte/icons/file-text';

	const moduleId = Number($page.params.module);
	const eventId = Number($page.url.searchParams.get('eventId'));
	let event = $state(mockEvents.find((e) => e.id === eventId) ?? mockEvents[0]);

	let name = $state(event.name);
	let description = $state(event.description);
	let venue = $state(event.venue);
	let minTeamSize = $state(event.minTeamSize);
	let maxTeamSize = $state(event.maxTeamSize);
	let prizeDescription = $state(event.prizeDescription);
	let stagesDescription = $state(event.stagesDescription);
	let registrationEndTime = $state(event.registrationEndTime);
	let activeTab = $state('details');

	function handleSaveDetails() {
		console.log('saving details...', { name, description, venue });
	}

	function handleImageChange(type: 'banner' | 'poster') {
		console.log('change image:', type);
	}

	function handleImageDelete(type: 'banner' | 'poster') {
		console.log('delete image:', type);
	}

	function handleDocUpload() {
		console.log('upload PDF');
	}

	function handleDocDelete(docName: string) {
		console.log('delete doc:', docName);
	}
</script>

<svelte:head>
	<title>Edit {event.name} — Tecnoesis Admin</title>
</svelte:head>

<div class="mb-6">
	<Button href="/modules/{moduleId}" variant="ghost" size="sm" class="mb-4 gap-1 pl-0">
		<ChevronLeft class="size-4" />
		Back to Module
	</Button>
	<h1 class="text-2xl font-bold">{event.name}</h1>
	<p class="text-muted-foreground text-sm">Edit event details, images and documents.</p>
</div>

<Tabs bind:value={activeTab}>
	<TabsList class="mb-6">
		<TabsTrigger value="details">Details</TabsTrigger>
		<TabsTrigger value="images">Images</TabsTrigger>
		<TabsTrigger value="documents">Documents</TabsTrigger>
	</TabsList>

	<!-- DETAILS -->
	<TabsContent value="details">
		<div class="max-w-2xl space-y-5">
			<div class="space-y-1.5">
				<Label for="name">Event Name</Label>
				<Input id="name" bind:value={name} />
			</div>
			<div class="space-y-1.5">
				<Label for="description">Description</Label>
				<Textarea id="description" bind:value={description} rows={4} />
			</div>
			<div class="space-y-1.5">
				<Label for="venue">Venue</Label>
				<Input id="venue" bind:value={venue} />
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
				<Textarea id="prize" bind:value={prizeDescription} rows={2} />
			</div>
			<div class="space-y-1.5">
				<Label for="stages">Stages Description</Label>
				<Textarea id="stages" bind:value={stagesDescription} rows={3} />
			</div>
			<Separator />
			<Button onclick={handleSaveDetails}>Save Changes</Button>
		</div>
	</TabsContent>

	<!-- IMAGES -->
	<TabsContent value="images">
		<div class="max-w-3xl space-y-8">
			<div>
				<p class="mb-3 font-medium">Banner Image</p>
				<div class="overflow-hidden rounded-lg border">
					<img src={event.bannerImage} alt="Banner" class="h-48 w-full object-cover" />
				</div>
				<div class="mt-3 flex gap-2">
					<Button variant="outline" size="sm" onclick={() => handleImageChange('banner')} class="gap-1.5">
						<Upload class="size-3.5" /> Change
					</Button>
					<Button variant="destructive" size="sm" onclick={() => handleImageDelete('banner')} class="gap-1.5">
						<Trash2 class="size-3.5" /> Remove
					</Button>
				</div>
			</div>
			<Separator />
			<div>
				<p class="mb-3 font-medium">Poster Image</p>
				<div class="overflow-hidden rounded-lg border">
					<img src={event.posterImage} alt="Poster" class="h-64 w-56 object-cover" />
				</div>
				<div class="mt-3 flex gap-2">
					<Button variant="outline" size="sm" onclick={() => handleImageChange('poster')} class="gap-1.5">
						<Upload class="size-3.5" /> Change
					</Button>
					<Button variant="destructive" size="sm" onclick={() => handleImageDelete('poster')} class="gap-1.5">
						<Trash2 class="size-3.5" /> Remove
					</Button>
				</div>
			</div>
		</div>
	</TabsContent>

	<!-- DOCUMENTS -->
	<TabsContent value="documents">
		<div class="max-w-xl">
			<div class="mb-4 flex items-center justify-between">
				<p class="font-medium">PDF Documents</p>
				<Button size="sm" onclick={handleDocUpload} class="gap-1.5">
					<Upload class="size-3.5" /> Upload PDF
				</Button>
			</div>
			{#if event.documents.length === 0}
				<div class="text-muted-foreground rounded-lg border border-dashed p-8 text-center text-sm">
					No documents uploaded yet.
				</div>
			{:else}
				<div class="flex flex-col gap-2">
					{#each event.documents as doc}
						<div class="flex items-center justify-between rounded-lg border px-4 py-3">
							<div class="flex items-center gap-2.5">
								<FileText class="text-muted-foreground size-4" />
								<span class="text-sm">{doc.name}</span>
							</div>
							<Button
								variant="ghost"
								size="sm"
								onclick={() => handleDocDelete(doc.name)}
								class="text-destructive hover:text-destructive gap-1.5"
							>
								<Trash2 class="size-3.5" /> Delete
							</Button>
						</div>
					{/each}
				</div>
			{/if}
		</div>
	</TabsContent>
</Tabs>
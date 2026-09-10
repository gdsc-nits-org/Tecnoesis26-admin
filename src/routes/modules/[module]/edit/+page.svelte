<script lang="ts">
	import { page } from '$app/stores';
	import { enhance } from '$app/forms';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Textarea } from '$lib/components/ui/textarea/index.js';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import { Tabs, TabsContent, TabsList, TabsTrigger } from '$lib/components/ui/tabs/index.js';
	import ChevronLeft from '@lucide/svelte/icons/chevron-left';
	import Upload from '@lucide/svelte/icons/upload';
	import Trash2 from '@lucide/svelte/icons/trash-2';

	let { data, form } = $props();

	let event = $derived(data.event);
	let moduleId = $derived($page.params.module);
	let eventId = $derived($page.url.searchParams.get('eventId') ?? '');

	let activeTab = $state('details');
	let saving = $state(false);
	let uploadingImage = $state(false);
</script>

<svelte:head>
	<title>Edit {event.name} — Tecnoesis Admin</title>
</svelte:head>

<div class="mb-6 flex items-start justify-between">
	<div>
		<Button href="/modules/{moduleId}" variant="ghost" size="sm" class="mb-4 gap-1 pl-0">
			<ChevronLeft class="size-4" />
			Back to Module
		</Button>
		<h1 class="text-2xl font-bold">{event.name}</h1>
		<p class="mt-1 text-sm text-muted-foreground">Edit event details, images and documents.</p>
	</div>

	<!-- DELETE FORM — eventId as hidden field -->
	<form method="POST" action="?/deleteEvent" use:enhance>
		<input type="hidden" name="eventId" value={eventId} />
		<Button
			type="submit"
			variant="destructive"
			size="sm"
			class="gap-1.5"
			onclick={(e) => {
				if (!confirm('Are you sure you want to delete this event?')) e.preventDefault();
			}}
		>
			<Trash2 class="size-3.5" />
			Delete Event
		</Button>
	</form>
</div>

{#if form?.error}
	<div class="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
		{form.error}
	</div>
{/if}

{#if form?.success}
	<div class="mb-4 rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-700">
		Saved successfully.
	</div>
{/if}

<Tabs bind:value={activeTab}>
	<TabsList class="mb-6">
		<TabsTrigger value="details">Details</TabsTrigger>
		<TabsTrigger value="images">Images</TabsTrigger>
		<TabsTrigger value="documents">Documents</TabsTrigger>
	</TabsList>

	<!-- DETAILS TAB -->
	<TabsContent value="details">
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
			<!-- eventId hidden field — this is the fix -->
			<input type="hidden" name="eventId" value={eventId} />

			<div class="space-y-1.5">
				<Label for="name">Event Name</Label>
				<Input id="name" name="name" value={event.name} />
			</div>
			<div class="space-y-1.5">
				<Label for="description">Description</Label>
				<Textarea id="description" name="description" value={event.description} rows={4} />
			</div>
			<div class="space-y-1.5">
				<Label for="venue">Venue</Label>
				<Input id="venue" name="venue" value={event.venue} />
			</div>
			<div class="grid grid-cols-2 gap-4">
				<div class="space-y-1.5">
					<Label for="minTeamSize">Min Team Size</Label>
					<Input
						id="minTeamSize"
						name="minTeamSize"
						type="number"
						value={event.min_team_size}
						min={1}
					/>
				</div>
				<div class="space-y-1.5">
					<Label for="maxTeamSize">Max Team Size</Label>
					<Input
						id="maxTeamSize"
						name="maxTeamSize"
						type="number"
						value={event.max_team_size}
						min={1}
					/>
				</div>
			</div>
			<div class="space-y-1.5">
				<Label for="registrationEndTime">Registration Close Date</Label>
				<Input
					id="registrationEndTime"
					name="registrationEndTime"
					type="date"
					value={event.registration_end_time?.split('T')[0]}
				/>
			</div>
			<div class="space-y-1.5">
				<Label for="prizeDescription">Prize Description</Label>
				<Textarea
					id="prizeDescription"
					name="prizeDescription"
					value={event.prize_description}
					rows={2}
				/>
			</div>
			<div class="space-y-1.5">
				<Label for="stagesDescription">Stages Description</Label>
				<Textarea
					id="stagesDescription"
					name="stagesDescription"
					value={event.stages_description}
					rows={3}
				/>
			</div>
			<Separator />
			<Button type="submit" disabled={saving}>
				{saving ? 'Saving...' : 'Save Changes'}
			</Button>
		</form>
	</TabsContent>

	<!-- IMAGES TAB -->
	<TabsContent value="images">
		<div class="max-w-3xl space-y-8">
			<!-- Banner -->
			<form
				method="POST"
				action="?/updateImage"
				enctype="multipart/form-data"
				use:enhance={() => {
					uploadingImage = true;
					return async ({ update }) => {
						await update();
						uploadingImage = false;
					};
				}}
			>
				<!-- eventId hidden field — this is the fix -->
				<input type="hidden" name="eventId" value={eventId} />
				<input type="hidden" name="imageType" value="banner" />

				<p class="mb-3 font-medium">Banner Image</p>
				<div class="mb-3 overflow-hidden rounded-lg border bg-muted/20">
					{#if event.banner_image && !event.banner_image.startsWith('data:')}
						<img src={event.banner_image} alt="Banner" class="h-48 w-full object-cover" />
					{:else}
						<div class="flex h-48 w-full items-center justify-center text-sm text-muted-foreground">
							No banner uploaded
						</div>
					{/if}
				</div>
				<div class="flex items-center gap-2">
					<Input type="file" name="image" accept="image/*" class="w-auto bg-white" required />
					<Button
						type="submit"
						size="sm"
						variant="outline"
						disabled={uploadingImage}
						class="shrink-0 gap-1.5"
					>
						<Upload class="size-3.5" />
						{uploadingImage ? 'Uploading...' : 'Upload Banner'}
					</Button>
				</div>
			</form>

			<Separator />

			<!-- Poster -->
			<form
				method="POST"
				action="?/updateImage"
				enctype="multipart/form-data"
				use:enhance={() => {
					uploadingImage = true;
					return async ({ update }) => {
						await update();
						uploadingImage = false;
					};
				}}
			>
				<!-- eventId hidden field — this is the fix -->
				<input type="hidden" name="eventId" value={eventId} />
				<input type="hidden" name="imageType" value="poster" />

				<p class="mb-3 font-medium">Poster Image</p>
				<div class="mb-3 w-56 overflow-hidden rounded-lg border bg-muted/20">
					{#if event.poster_image && !event.poster_image.startsWith('data:')}
						<img src={event.poster_image} alt="Poster" class="h-64 w-56 object-cover" />
					{:else}
						<div class="flex h-64 w-56 items-center justify-center text-sm text-muted-foreground">
							No poster uploaded
						</div>
					{/if}
				</div>
				<div class="flex w-56 flex-col gap-2">
					<Input type="file" name="image" accept="image/*" class="bg-white" required />
					<Button
						type="submit"
						size="sm"
						variant="outline"
						disabled={uploadingImage}
						class="gap-1.5"
					>
						<Upload class="size-3.5" />
						{uploadingImage ? 'Uploading...' : 'Upload Poster'}
					</Button>
				</div>
			</form>
		</div>
	</TabsContent>

	<!-- DOCUMENTS TAB -->
	<TabsContent value="documents">
		<div class="max-w-xl">
			<div class="mb-4 flex items-center justify-between">
				<p class="font-medium">PDF Documents</p>
				<Button size="sm" class="gap-1.5">
					<Upload class="size-3.5" /> Upload PDF
				</Button>
			</div>
			<div class="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
				No documents uploaded yet. (PDF support coming soon!)
			</div>
		</div>
	</TabsContent>
</Tabs>

<script lang="ts">
	import { page } from '$app/stores';
	import { enhance } from '$app/forms';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import ChevronLeft from '@lucide/svelte/icons/chevron-left';
	import Plus from '@lucide/svelte/icons/plus';
	import MapPin from '@lucide/svelte/icons/map-pin';
	import Calendar from '@lucide/svelte/icons/calendar';
	import Trash2 from '@lucide/svelte/icons/trash-2';

	let { data } = $props();

	let currentModule = $derived(data.module);
	let moduleEvents = $derived(data.events ?? []);
	let moduleId = $derived($page.params.module);
</script>

<svelte:head>
	<title>{currentModule?.name ?? 'Module'} Events — Tecnoesis Admin</title>
</svelte:head>

<div class="mb-6 flex items-start justify-between">
	<div>
		<Button href="/modules" variant="ghost" size="sm" class="mb-4 gap-1 pl-0">
			<ChevronLeft class="size-4" />
			Back to Modules
		</Button>
		<h1 class="text-2xl font-bold">{currentModule?.name} Events</h1>
		<p class="text-muted-foreground mt-1 text-sm">{currentModule?.description}</p>
	</div>

	<div class="flex items-center gap-2">
		<!-- Delete Module -->
		<form
			method="POST"
			action="?/deleteModule"
			use:enhance
		>
			<Button
				type="submit"
				variant="destructive"
				size="sm"
				class="gap-1.5"
				onclick={(e) => {
					if (!confirm('Delete this module and all its events? This cannot be undone.'))
						e.preventDefault();
				}}
			>
				<Trash2 class="size-3.5" />
				Delete Module
			</Button>
		</form>

		<!-- Create Event -->
		<Button href="/modules/{moduleId}/create" size="sm" class="gap-1.5">
			<Plus class="size-3.5" />
			Create Event
		</Button>
	</div>
</div>

{#if moduleEvents.length === 0}
	<div class="text-muted-foreground rounded-lg border border-dashed p-8 text-center text-sm">
		No events found for this module.
	</div>
{:else}
	<div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
		{#each moduleEvents as event}
			<div class="flex flex-col justify-between rounded-lg border p-5 shadow-sm transition hover:shadow-md">
				<div>
					<div class="mb-3 flex items-start justify-between gap-4">
						<h3 class="text-lg font-semibold">{event.name}</h3>
						<Badge variant="secondary" class="shrink-0">
							Team: {event.min_team_size}-{event.max_team_size}
						</Badge>
					</div>
					<p class="text-muted-foreground mb-4 line-clamp-2 text-sm">{event.description}</p>

					<div class="mb-6 space-y-2 text-sm text-muted-foreground">
						<div class="flex items-center gap-2">
							<MapPin class="size-4 shrink-0" />
							<span>{event.venue}</span>
						</div>
						<div class="flex items-center gap-2">
							<Calendar class="size-4 shrink-0" />
							<span>
								Closes: {new Date(event.registration_end_time).toLocaleDateString('en-IN')}
							</span>
						</div>
					</div>
				</div>

				<div class="mt-auto grid grid-cols-2 gap-2 border-t pt-4">
					<Button
						href="/modules/{moduleId}/registrations?eventId={event.id}"
						variant="outline"
						class="w-full"
					>
						Registrations
					</Button>
					<Button href="/modules/{moduleId}/edit?eventId={event.id}" class="w-full">
						Edit Event
					</Button>
				</div>
			</div>
		{/each}
	</div>
{/if}
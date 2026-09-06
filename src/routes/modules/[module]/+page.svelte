<script lang="ts">
	import { page } from '$app/stores';
	import { mockModules, mockEvents } from '$lib/mock/data';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import ChevronLeft from '@lucide/svelte/icons/chevron-left';
	import Plus from '@lucide/svelte/icons/plus';
	import MapPin from '@lucide/svelte/icons/map-pin';
	import Calendar from '@lucide/svelte/icons/calendar';

	let moduleId = $derived(Number($page.params.module));
	let currentModule = $derived(mockModules.find((m) => m.id === moduleId));
	let moduleEvents = $derived(mockEvents.filter((e) => e.moduleId === moduleId));
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
	<Button href="/modules/{moduleId}/create" size="sm" class="gap-1.5">
		<Plus class="size-3.5" />
		Create Event
	</Button>
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
						<h3 class="font-semibold text-lg">{event.name}</h3>
						<Badge variant="secondary" class="shrink-0">
							Team: {event.minTeamSize}-{event.maxTeamSize}
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
							<span>Closes: {new Date(event.registrationEndTime).toLocaleDateString('en-IN')}</span>
						</div>
					</div>
				</div>

				<div class="grid grid-cols-2 gap-2 pt-4 border-t mt-auto">
					<Button href="/modules/{moduleId}/registrations?eventId={event.id}" variant="outline" class="w-full">
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
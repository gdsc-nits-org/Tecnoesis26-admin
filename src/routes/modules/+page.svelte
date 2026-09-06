<script lang="ts">
	import { mockUser, mockModules } from '$lib/mock/data';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import Plus from '@lucide/svelte/icons/plus';

	const isSuperAdmin = mockUser.role === 'super_admin';

	const assignedModuleIds = isSuperAdmin
		? mockModules.map((m) => m.id)
		: [1];

	const visibleModules = mockModules.filter((m) => assignedModuleIds.includes(m.id));
</script>

<svelte:head>
	<title>Modules — Tecnoesis Admin</title>
</svelte:head>

<div class="mb-6 flex items-center justify-between">
	<div>
		<h1 class="text-2xl font-bold">Modules</h1>
		<p class="text-muted-foreground text-sm">
			{isSuperAdmin ? 'All modules across Tecnoesis.' : 'Modules assigned to you.'}
		</p>
	</div>
	{#if isSuperAdmin}
		<Button href="/modules/create" size="sm" class="gap-1.5">
			<Plus class="size-3.5" />
			Create Module
		</Button>
	{/if}
</div>

{#if visibleModules.length === 0}
	<div class="text-muted-foreground rounded-lg border border-dashed p-8 text-center text-sm">
		No modules assigned to you yet.
	</div>
{:else}
	<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
		{#each visibleModules as mod}
			<a href="/modules/{mod.id}" class="group overflow-hidden rounded-lg border transition hover:shadow-md">
				<div class="relative h-32">
					<img
						src={mod.coverImage}
						alt={mod.name}
						class="h-full w-full object-cover transition group-hover:scale-105"
					/>
					<div class="absolute inset-0 bg-black/30" />
					<img
						src={mod.iconImage}
						alt=""
						class="absolute bottom-3 left-3 size-10 rounded-lg border-2 border-white object-cover shadow"
					/>
				</div>
				<div class="p-4">
					<div class="flex items-start justify-between gap-2">
						<p class="font-semibold">{mod.name}</p>
						<Badge variant="secondary" class="shrink-0 text-xs">
							{mod.eventCount} {mod.eventCount === 1 ? 'event' : 'events'}
						</Badge>
					</div>
					{#if mod.description}
						<p class="text-muted-foreground mt-1 line-clamp-2 text-xs">{mod.description}</p>
					{/if}
				</div>
			</a>
		{/each}

		{#if isSuperAdmin}
			<Button
				href="/modules/create"
				variant="ghost"
				class="text-muted-foreground hover:border-foreground/30 hover:text-foreground min-h-[160px] w-full gap-1.5 rounded-lg border border-dashed"
			>
				<Plus class="size-4" />
				Create Module
			</Button>
		{/if}
	</div>
{/if}
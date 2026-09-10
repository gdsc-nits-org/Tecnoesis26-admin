<script lang="ts">
	import { page } from '$app/stores';
	import { mockEvents, mockRegistrations } from '$lib/mock/data';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import {
		Table,
		TableBody,
		TableCell,
		TableHead,
		TableHeader,
		TableRow
	} from '$lib/components/ui/table/index.js';
	import ChevronDown from '@lucide/svelte/icons/chevron-down';
	import ChevronRight from '@lucide/svelte/icons/chevron-right';
	import ChevronLeft from '@lucide/svelte/icons/chevron-left';
	import Mail from '@lucide/svelte/icons/mail';
	import Phone from '@lucide/svelte/icons/phone';
	import Hash from '@lucide/svelte/icons/hash';
	import Download from '@lucide/svelte/icons/download';

	const moduleId = Number($page.params.module);
	const eventId = Number($page.url.searchParams.get('eventId'));
	const event = mockEvents.find((e) => e.id === eventId) ?? mockEvents[0];
	const registrations = mockRegistrations.filter((r) => r.eventId === event.id);

	function getStatusVariant(status: string): 'default' | 'secondary' | 'destructive' | 'outline' {
		if (status === 'REGISTERED') return 'default';
		if (status === 'CANCELLED') return 'destructive';
		return 'secondary';
	}

	let expandedTeams = $state<Set<string>>(new Set());

	function toggleTeam(teamName: string) {
		const next = new Set(expandedTeams);
		if (next.has(teamName)) {
			next.delete(teamName);
		} else {
			next.add(teamName);
		}
		expandedTeams = next;
	}

	function getInitials(firstName: string, lastName: string) {
		return `${firstName[0]}${lastName[0]}`.toUpperCase();
	}

	function handleDownloadExcel() {
		console.log('download excel for event', event.id);
	}
</script>

<svelte:head>
	<title>Registrations — {event.name} — Tecnoesis Admin</title>
</svelte:head>

<div class="mb-6">
	<Button href="/modules/{moduleId}" variant="ghost" size="sm" class="mb-4 gap-1 pl-0">
		<ChevronLeft class="size-4" />
		Back to Module
	</Button>
	<h1 class="text-2xl font-bold">{event.name}</h1>
	<p class="text-sm text-muted-foreground">Registered teams and participants.</p>
</div>

<div class="mb-4 flex items-center justify-between">
	<p class="text-sm text-muted-foreground">
		{registrations.length}
		{registrations.length === 1 ? 'team' : 'teams'} ·
		{registrations.reduce((acc, r) => acc + r.members.length, 0)} participants
	</p>
	<Button variant="outline" size="sm" onclick={handleDownloadExcel} class="gap-1.5">
		<Download class="size-3.5" />
		Download Excel
	</Button>
</div>

{#if registrations.length === 0}
	<div class="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
		No registrations yet for this event.
	</div>
{:else}
	<div class="rounded-lg border">
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead class="w-8"></TableHead>
					<TableHead>Team Name</TableHead>
					<TableHead>Members</TableHead>
					<TableHead>Status</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{#each registrations as reg}
					<TableRow
						class="cursor-pointer transition-colors hover:bg-muted/50"
						onclick={() => toggleTeam(reg.teamName)}
					>
						<TableCell class="pr-0">
							{#if expandedTeams.has(reg.teamName)}
								<ChevronDown class="size-4 text-muted-foreground" />
							{:else}
								<ChevronRight class="size-4 text-muted-foreground" />
							{/if}
						</TableCell>
						<TableCell class="font-medium">{reg.teamName}</TableCell>
						<TableCell class="text-sm text-muted-foreground">
							{reg.members.length}
							{reg.members.length === 1 ? 'member' : 'members'}
						</TableCell>
						<TableCell>
							<Badge variant={getStatusVariant(reg.registrationStatus)}>
								{reg.registrationStatus}
							</Badge>
						</TableCell>
					</TableRow>

					{#if expandedTeams.has(reg.teamName)}
						<TableRow class="hover:bg-transparent">
							<TableCell colspan={4} class="bg-muted/30 px-6 py-4">
								<div class="flex flex-col gap-2">
									{#each reg.members as member}
										<div
											class="flex items-start gap-3 rounded-lg border bg-white px-4 py-3 shadow-sm"
										>
											<div
												class="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground"
											>
												{getInitials(member.firstName, member.lastName)}
											</div>
											<div class="min-w-0 flex-1">
												<div class="flex items-baseline gap-2">
													<p class="font-medium">{member.firstName} {member.lastName}</p>
													<p class="text-xs text-muted-foreground">@{member.username}</p>
												</div>
												<div
													class="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground"
												>
													<span class="flex items-center gap-1">
														<Mail class="size-3 shrink-0" />
														{member.email}
													</span>
													<span class="flex items-center gap-1">
														<Phone class="size-3 shrink-0" />
														{member.phoneNumber}
													</span>
													<span class="flex items-center gap-1">
														<Hash class="size-3 shrink-0" />
														{member.registrationId}
													</span>
												</div>
											</div>
										</div>
									{/each}
								</div>
							</TableCell>
						</TableRow>
					{/if}
				{/each}
			</TableBody>
		</Table>
	</div>
{/if}

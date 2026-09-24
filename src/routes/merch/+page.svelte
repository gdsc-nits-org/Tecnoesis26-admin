<script lang="ts">
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import {
		Table,
		TableBody,
		TableCell,
		TableHead,
		TableHeader,
		TableRow
	} from '$lib/components/ui/table/index.js';
	import Download from '@lucide/svelte/icons/download';
	import ChevronLeft from '@lucide/svelte/icons/chevron-left';

	let { data } = $props();
</script>

<svelte:head>
	<title>Merch Orders — Tecnoesis Admin</title>
</svelte:head>

<div class="mx-auto max-w-7xl p-6">
	<div class="mb-6 flex items-start justify-between">
		<div>
			<Button href="/modules" variant="ghost" size="sm" class="mb-4 gap-1 pl-0">
				<ChevronLeft class="size-4" />
				Back to Modules
			</Button>
			<h1 class="text-2xl font-bold">Merch Orders</h1>
			<p class="mt-1 text-sm text-muted-foreground">
				All merchandise orders placed by participants.
			</p>
		</div>
		<Button href="/merch/export" variant="outline" size="sm" class="mt-8 gap-1.5">
			<Download class="size-3.5" />
			Download Excel
		</Button>
	</div>

	<!-- Summary -->
	<div class="mb-6 grid grid-cols-3 gap-4">
		<div class="rounded-lg border p-4">
			<p class="text-xs text-muted-foreground">Total Orders</p>
			<p class="mt-1 text-2xl font-bold">{data.summary.total}</p>
		</div>
		<div class="rounded-lg border p-4">
			<p class="text-xs text-muted-foreground">Tecnoesis</p>
			<p class="mt-1 text-2xl font-bold">{data.summary.tecnoesis}</p>
		</div>
		<div class="rounded-lg border p-4">
			<p class="text-xs text-muted-foreground">Spark</p>
			<p class="mt-1 text-2xl font-bold">{data.summary.spark}</p>
		</div>
	</div>

	<div class="rounded-lg border">
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>Name</TableHead>
					<TableHead>Email</TableHead>
					<TableHead>Phone</TableHead>
					<TableHead>Type</TableHead>
					<TableHead>Size</TableHead>
					<TableHead>Hostel</TableHead>
					<TableHead>Ordered</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{#each data.orders as order}
					<TableRow>
						<TableCell class="font-medium">{order.name ?? '-'}</TableCell>
						<TableCell class="text-sm text-muted-foreground">{order.email ?? '-'}</TableCell>
						<TableCell class="text-sm text-muted-foreground">{order.phone ?? '-'}</TableCell>
						<TableCell>
							{#if order.tecno}<Badge variant="default">Tecnoesis</Badge>{/if}
							{#if order.spark}<Badge variant="secondary">Spark</Badge>{/if}
						</TableCell>
						<TableCell>{order.size}</TableCell>
						<TableCell class="text-sm text-muted-foreground">
							{order.hostel ?? '-'}
						</TableCell>
						<TableCell class="text-sm text-muted-foreground">
							{new Date(order.created_at).toLocaleDateString('en-IN')}
						</TableCell>
					</TableRow>
				{/each}
			</TableBody>
		</Table>
	</div>
</div>

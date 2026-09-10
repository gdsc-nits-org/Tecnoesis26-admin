<script lang="ts">
	import { goto } from '$app/navigation';
	import { mockUser, mockMerchOrders } from '$lib/mock/data';
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

	if (mockUser.role !== 'super_admin') goto('/modules');

	const tecnoesisCount = mockMerchOrders.filter((o) => o.type === 'Tecnoesis').length;
	const sparkCount = mockMerchOrders.filter((o) => o.type === 'Spark').length;

	function handleDownload() {
		console.log('download merch orders excel');
	}
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
		<Button variant="outline" size="sm" onclick={handleDownload} class="mt-8 gap-1.5">
			<Download class="size-3.5" />
			Download Excel
		</Button>
	</div>

	<!-- Summary -->
	<div class="mb-6 grid grid-cols-3 gap-4">
		<div class="rounded-lg border p-4">
			<p class="text-xs text-muted-foreground">Total Orders</p>
			<p class="mt-1 text-2xl font-bold">{mockMerchOrders.length}</p>
		</div>
		<div class="rounded-lg border p-4">
			<p class="text-xs text-muted-foreground">Tecnoesis</p>
			<p class="mt-1 text-2xl font-bold">{tecnoesisCount}</p>
		</div>
		<div class="rounded-lg border p-4">
			<p class="text-xs text-muted-foreground">Spark</p>
			<p class="mt-1 text-2xl font-bold">{sparkCount}</p>
		</div>
	</div>

	<div class="rounded-lg border">
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>Name</TableHead>
					<TableHead>Email</TableHead>
					<TableHead>Reg ID</TableHead>
					<TableHead>Type</TableHead>
					<TableHead>Size</TableHead>
					<TableHead>Ordered</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{#each mockMerchOrders as order}
					<TableRow>
						<TableCell class="font-medium">
							{order.user.firstName}
							{order.user.lastName}
						</TableCell>
						<TableCell class="text-sm text-muted-foreground">{order.user.email}</TableCell>
						<TableCell class="text-sm text-muted-foreground">{order.user.registrationId}</TableCell>
						<TableCell>
							<Badge variant={order.type === 'Tecnoesis' ? 'default' : 'secondary'}>
								{order.type}
							</Badge>
						</TableCell>
						<TableCell>{order.size}</TableCell>
						<TableCell class="text-sm text-muted-foreground">
							{new Date(order.createdAt).toLocaleDateString('en-IN')}
						</TableCell>
					</TableRow>
				{/each}
			</TableBody>
		</Table>
	</div>
</div>

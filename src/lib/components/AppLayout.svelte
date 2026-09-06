<script lang="ts">
	import { page } from '$app/stores';
	import { enhance } from '$app/forms';
	import LayoutDashboard from '@lucide/svelte/icons/layout-dashboard';
	import ShieldCheck from '@lucide/svelte/icons/shield-check';
	import ShoppingBag from '@lucide/svelte/icons/shopping-bag';
	import Users from '@lucide/svelte/icons/users';
	import LogOut from '@lucide/svelte/icons/log-out';
	import {
		Sidebar, SidebarContent, SidebarFooter, SidebarGroup,
		SidebarGroupContent, SidebarGroupLabel, SidebarHeader,
		SidebarInset, SidebarMenu, SidebarMenuButton,
		SidebarMenuItem, SidebarProvider, SidebarTrigger, SidebarSeparator
	} from '$lib/components/ui/sidebar/index.js';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { invalidateAll } from '$app/navigation';

	let { data, children } = $props();

	// Derived states based on the layout data
	let role = $derived(data.user?.role ?? 'admin');
	let isSuperAdmin = $derived(role === 'super_admin');

	const navItems = [
		{ label: 'Modules', href: '/modules', icon: LayoutDashboard }
	];

	const superAdminItems = [
		{ label: 'Admin Users', href: '/admin', icon: Users },
		{ label: 'Merch Orders', href: '/merch', icon: ShoppingBag }
	];

	function isActive(href: string) {
		if (href === '/modules') return $page.url.pathname === '/modules';
		return $page.url.pathname.startsWith(href);
	}

	// Dev Toggle Logic
	async function toggleDevRole() {
		const newRole = role === 'admin' ? 'super_admin' : 'admin';
		document.cookie = `dev_role=${newRole}; path=/; max-age=3600`;
		await invalidateAll();
	}
</script>

<SidebarProvider>
	<Sidebar>
		<SidebarHeader>
			<div class="px-2 py-3">
				<p class="text-lg font-bold tracking-tight">Tecnoesis</p>
				<p class="text-muted-foreground text-xs">Admin Panel</p>
			</div>
		</SidebarHeader>

		<SidebarContent>
			<!-- Main nav -->
			<SidebarGroup>
				<SidebarGroupContent>
					<SidebarMenu>
						{#each navItems as item}
							<SidebarMenuItem>
								<!-- THE FIX: Wrapping an <a> tag inside the child snippet -->
								<SidebarMenuButton isActive={isActive(item.href)}>
									{#snippet child({ props })}
										<a href={item.href} {...props}>
											<item.icon class="size-4" />
											<span>{item.label}</span>
										</a>
									{/snippet}
								</SidebarMenuButton>
							</SidebarMenuItem>
						{/each}
					</SidebarMenu>
				</SidebarGroupContent>
			</SidebarGroup>

			<!-- Super admin section -->
			{#if isSuperAdmin}
				<SidebarSeparator />
				<SidebarGroup>
					<SidebarGroupLabel class="flex items-center gap-1.5">
						<ShieldCheck class="size-3" />
						Super Admin
					</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{#each superAdminItems as item}
								<SidebarMenuItem>
									<!-- THE FIX: Wrapping an <a> tag inside the child snippet -->
									<SidebarMenuButton isActive={isActive(item.href)}>
										{#snippet child({ props })}
											<a href={item.href} {...props}>
												<item.icon class="size-4" />
												<span>{item.label}</span>
											</a>
										{/snippet}
									</SidebarMenuButton>
								</SidebarMenuItem>
							{/each}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			{/if}
		</SidebarContent>

		<SidebarFooter>
			<Separator />
			<div class="px-2 py-3">
				<div class="mb-2 flex items-center gap-2">
					<p class="text-muted-foreground truncate text-xs">
						{data.user?.email ?? 'dev@tecnoesis.club'}
					</p>
					<Badge variant={isSuperAdmin ? 'default' : 'secondary'} class="shrink-0 text-xs">
						{isSuperAdmin ? 'Super Admin' : 'Admin'}
					</Badge>
				</div>
				<form method="POST" action="/logout" use:enhance>
					<button
						type="submit"
						class="text-muted-foreground hover:text-foreground flex w-full items-center gap-2 text-sm transition"
					>
						<LogOut class="size-4" />
						Logout
					</button>
				</form>
			</div>
		</SidebarFooter>
	</Sidebar>

	<SidebarInset>
		<header class="flex h-14 items-center gap-2 border-b px-4">
			<SidebarTrigger />
		</header>
		<main class="p-6">
			{@render children()}
		</main>
	</SidebarInset>
</SidebarProvider>

<!-- TEMPORARY DEV TOGGLE -->
<div class="fixed bottom-6 right-6 z-50">
	<button
		onclick={toggleDevRole}
		class="flex items-center gap-2 rounded-full border border-zinc-700 bg-zinc-900 px-4 py-2 font-mono text-sm font-medium text-white shadow-lg transition-colors hover:bg-zinc-700"
	>
		<div class="h-2 w-2 rounded-full {role === 'super_admin' ? 'bg-red-500' : 'bg-emerald-500'}"></div>
		DEV: {role}
	</button>
</div>
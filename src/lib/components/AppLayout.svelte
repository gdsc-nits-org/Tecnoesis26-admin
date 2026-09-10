<script lang="ts">
    import { page } from '$app/stores';
    import { enhance } from '$app/forms';
    import LayoutDashboard from '@lucide/svelte/icons/layout-dashboard';
    import ShieldCheck from '@lucide/svelte/icons/shield-check';
    import ShoppingBag from '@lucide/svelte/icons/shopping-bag';
    import Users from '@lucide/svelte/icons/users';
    import LogOut from '@lucide/svelte/icons/log-out';
    import {
        Sidebar,
        SidebarContent,
        SidebarFooter,
        SidebarGroup,
        SidebarGroupContent,
        SidebarGroupLabel,
        SidebarHeader,
        SidebarInset,
        SidebarMenu,
        SidebarMenuButton,
        SidebarMenuItem,
        SidebarProvider,
        SidebarTrigger,
        SidebarSeparator
    } from '$lib/components/ui/sidebar/index.js';
    import { Separator } from '$lib/components/ui/separator/index.js';
    import { Badge } from '$lib/components/ui/badge/index.js';

    let { data, children } = $props();

    // Derived states based on the REAL layout data coming from the database
    let role = $derived(data.user?.role);
    let isSuperAdmin = $derived(role === 'super_admin');

    const navItems = [{ label: 'Modules', href: '/modules', icon: LayoutDashboard }];

    const superAdminItems = [
        { label: 'Admin Users', href: '/admin', icon: Users },
        { label: 'Merch Orders', href: '/merch', icon: ShoppingBag }
    ];

    function isActive(href: string) {
        if (href === '/modules') return $page.url.pathname === '/modules';
        return $page.url.pathname.startsWith(href);
    }
</script>

<SidebarProvider>
    <Sidebar>
        <SidebarHeader>
            <div class="px-2 py-3">
                <p class="text-lg font-bold tracking-tight">Tecnoesis</p>
                <p class="text-xs text-muted-foreground">Admin Panel</p>
            </div>
        </SidebarHeader>

        <SidebarContent>
            <!-- Main nav -->
            <SidebarGroup>
                <SidebarGroupContent>
                    <SidebarMenu>
                        <!-- ADDED (item.href) HERE -->
                        {#each navItems as item (item.href)}
                            <SidebarMenuItem>
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
                            <!-- ADDED (item.href) HERE -->
                            {#each superAdminItems as item (item.href)}
                                <SidebarMenuItem>
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
                    <p class="truncate text-xs text-muted-foreground">
                        {data.user?.email}
                    </p>
                    <Badge variant={isSuperAdmin ? 'default' : 'secondary'} class="shrink-0 text-xs">
                        {isSuperAdmin ? 'Super Admin' : 'Admin'}
                    </Badge>
                </div>
                <form method="POST" action="/logout" use:enhance>
                    <button
                        type="submit"
                        class="flex w-full items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"
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
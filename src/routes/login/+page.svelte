<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';

	let { form } = $props();
	let email = $state('');
	let password = $state('');
	let loading = $state(false);
</script>

<svelte:head>
	<title>Login — Tecnoesis Admin</title>
</svelte:head>

<div class="flex min-h-screen items-center justify-center px-4">
	<div class="w-full max-w-sm">
		<div class="mb-8 text-center">
			<h1 class="text-2xl font-bold">Tecnoesis Admin</h1>
			<p class="mt-1 text-sm text-muted-foreground">Sign in to the admin panel</p>
		</div>

		<div class="rounded-xl border bg-white p-6 shadow-sm">
			<form
				method="POST"
				class="space-y-4"
				use:enhance={() => {
					loading = true;
					return async ({ update }) => {
						await update();
						loading = false;
					};
				}}
			>
				<div class="space-y-1.5">
					<Label for="email">Email address</Label>
					<Input
						id="email"
						name="email"
						type="email"
						bind:value={email}
						placeholder="you@nits.ac.in"
						required
					/>
				</div>
				<div class="space-y-1.5">
					<Label for="password">Password</Label>
					<Input id="password" name="password" type="password" bind:value={password} required />
				</div>

				{#if form?.error}
					<p class="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
						{form.error}
					</p>
				{/if}

				<Button type="submit" class="w-full" disabled={loading}>
					{loading ? 'Signing in...' : 'Sign in'}
				</Button>
			</form>

			<p class="mt-4 text-center text-sm text-muted-foreground">
				First time here? <a class="font-medium text-foreground underline" href="/register"
					>Register</a
				>
			</p>
		</div>
	</div>
</div>

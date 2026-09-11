<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';

	let { form } = $props();
	let email = $state('');
	let password = $state('');
	let confirmPassword = $state('');
	let loading = $state(false);
</script>

<svelte:head>
	<title>Register — Tecnoesis Admin</title>
</svelte:head>

<div class="flex min-h-screen items-center justify-center px-4">
	<div class="w-full max-w-sm">
		<div class="mb-8 text-center">
			<h1 class="text-2xl font-bold">Create your admin account</h1>
			<p class="mt-1 text-sm text-muted-foreground">Use the email added by a Super Admin</p>
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
					<Input id="email" name="email" type="email" bind:value={email} placeholder="you@nits.ac.in" required />
				</div>
				<div class="space-y-1.5">
					<Label for="password">Password</Label>
					<Input id="password" name="password" type="password" bind:value={password} minlength={6} required />
				</div>
				<div class="space-y-1.5">
					<Label for="confirmPassword">Confirm password</Label>
					<Input id="confirmPassword" name="confirmPassword" type="password" bind:value={confirmPassword} minlength={6} required />
				</div>

				{#if form?.success}
					<p class="rounded-md border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">
						Registration successful. Check your email to confirm your account, then sign in.
					</p>
				{:else if form?.error}
					<p class="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{form.error}</p>
				{/if}

				<Button type="submit" class="w-full" disabled={loading}>
					{loading ? 'Registering...' : 'Register'}
				</Button>
			</form>

			<p class="mt-4 text-center text-sm text-muted-foreground">
				Already registered? <a class="font-medium text-foreground underline" href="/login">Sign in</a>
			</p>
		</div>
	</div>
</div>

<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';

	let { form } = $props();

	let step = $derived(form?.success ? 'otp' : 'email');
	let email = $state(form?.email ?? '');
	let otp = $state(''); 
	let loading = $state(false);
</script>

<svelte:head>
	<title>Login — Tecnoesis Admin</title>
</svelte:head>

<div class="flex min-h-screen items-center justify-center px-4">
	<div class="w-full max-w-sm">
		<div class="mb-8 text-center">
			<h1 class="text-2xl font-bold">Tecnoesis Admin</h1>
			<p class="mt-1 text-sm text-muted-foreground">Sign in with your club email</p>
		</div>

		<div class="rounded-xl border bg-white p-6 shadow-sm">
			{#if step === 'email'}
				<!-- Step 1: Request OTP -->
					<form 
						method="POST" 
						action="?/sendOtp" 
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

						{#if form?.error}
							<p class="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
								{form.error}
							</p>
						{/if}

						<Button type="submit" class="w-full" disabled={loading}>
							{loading ? 'Sending...' : 'Send OTP'}
						</Button>
					</form>
				{:else}
					<!-- Step 2: Verify OTP -->
					<form 
						method="POST" 
						action="?/verifyOtp" 
						class="space-y-4"
						use:enhance={() => {
							loading = true;
							return async ({ update }) => {
								await update();
								loading = false;
							};
						}}
					>
						<!-- Guarantee both values are sent using hidden native inputs and the secure form object -->
						<input type="hidden" name="email" value={form?.email || email} />
						<input type="hidden" name="otp" value={otp} />

						<div class="space-y-1.5">
							<Label for="otp">Enter OTP</Label>
							<p class="text-xs text-muted-foreground">
								We sent an 8-digit code to <strong>{form?.email || email}</strong>
							</p>
							<Input
								id="otp"
								type="text"
								inputmode="numeric"
								maxlength={8}
								placeholder="00000000"
								class="text-center tracking-widest"
								bind:value={otp} 
								required
							/>
						</div>

						{#if form?.error}
							<p class="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
								{form.error}
							</p>
						{/if}

						<Button type="submit" class="w-full" disabled={loading}>
							{loading ? 'Verifying...' : 'Verify OTP'}
						</Button>
					</form>
			{/if}
		</div>
	</div>
</div>
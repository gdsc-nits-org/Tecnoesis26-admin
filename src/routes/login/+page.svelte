<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';

	let { form } = $props();

	let step = $state<'email' | 'otp'>('email');
	let email = $state('');
	let loading = $state(false);

	function handleEmailSubmit() {
		// will call supabase.auth.signInWithOtp() later
		// for now just move to step 2
		step = 'otp';
	}
</script>

<svelte:head>
	<title>Login — Tecnoesis Admin</title>
</svelte:head>

<div class="flex min-h-screen items-center justify-center px-4">
	<div class="w-full max-w-sm">
		<div class="mb-8 text-center">
			<h1 class="text-2xl font-bold">Tecnoesis Admin</h1>
			<p class="text-muted-foreground mt-1 text-sm">Sign in with your club email</p>
		</div>

		<div class="rounded-xl border bg-white p-6 shadow-sm">
			{#if step === 'email'}
				<!-- Step 1: Email -->
				<div class="space-y-4">
					<div class="space-y-1.5">
						<Label for="email">Email address</Label>
						<Input
							id="email"
							type="email"
							bind:value={email}
							placeholder="you@tecnoesis.club"
						/>
					</div>

					{#if form?.error}
						<p class="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
							{form.error}
						</p>
					{/if}

					<Button class="w-full" onclick={handleEmailSubmit}>
						Send OTP
					</Button>
				</div>

			{:else}
				<!-- Step 2: OTP -->
				<form method="POST" action="?/login" use:enhance class="space-y-4">
					<input type="hidden" name="email" value={email} />

					<div class="space-y-1.5">
						<Label for="otp">Enter OTP</Label>
						<p class="text-muted-foreground text-xs">
							We sent a 6-digit code to <strong>{email}</strong>
						</p>
						<Input
							id="otp"
							name="otp"
							type="text"
							inputmode="numeric"
							maxlength={6}
							placeholder="000000"
							class="text-center tracking-widest"
						/>
					</div>

					{#if form?.error}
						<p class="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
							{form.error}
						</p>
					{/if}

					<Button type="submit" class="w-full">Verify OTP</Button>

					<button
						type="button"
						onclick={() => (step = 'email')}
						class="text-muted-foreground hover:text-foreground w-full text-center text-xs transition"
					>
						Use a different email
					</button>
				</form>
			{/if}
		</div>
	</div>
</div>
<script lang="ts">
	import { enhance } from '$app/forms';

	let { form } = $props();
</script>

<svelte:head>
	<title>Login</title>
</svelte:head>

<div class="mx-auto flex min-h-screen max-w-md items-center justify-center px-4">
	<form method="POST" action="?/login" use:enhance class="w-full rounded-xl border bg-white p-6 shadow-sm">
		<h1 class="mb-6 text-2xl font-semibold">Admin Login</h1>

		<label class="mb-4 block">
			<span class="mb-2 block text-sm font-medium text-slate-700">Email</span>
			<input
				type="email"
				name="email"
				required
				class="w-full rounded-md border border-slate-300 px-3 py-2 outline-none ring-0 transition focus:border-slate-500"
				placeholder="admin@tecnoesis.in"
			/>
		</label>

		<label class="mb-6 block">
			<span class="mb-2 block text-sm font-medium text-slate-700">Password</span>
			<input
				type="password"
				name="password"
				required
				class="w-full rounded-md border border-slate-300 px-3 py-2 outline-none ring-0 transition focus:border-slate-500"
				placeholder="••••••••"
			/>
		</label>

		{#if form?.error}
			<p class="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
				{form.error}
			</p>
		{/if}

		<button
			type="submit"
			class="w-full rounded-md bg-slate-900 px-4 py-2.5 font-medium text-white transition hover:bg-slate-700"
		>
			Sign in
		</button>
	</form>
</div>

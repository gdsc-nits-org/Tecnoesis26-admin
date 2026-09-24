<script lang="ts">
	import AppLayout from '$lib/components/AppLayout.svelte';
	let { data, children } = $props();
</script>

<AppLayout {data}>
	{@render children()}
</AppLayout>

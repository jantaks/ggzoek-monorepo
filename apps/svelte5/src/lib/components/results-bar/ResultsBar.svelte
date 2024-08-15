<script lang="ts">
	import SaveSearchButton from '$lib/components/results-bar/SaveSearchButton.svelte';

	type Props = {
		count?: number;
		loading: boolean;
	}

	let { count, loading }: Props = $props();
</script>


<div class="gap-2 w-full h-fit lg:text-xl">
	{#if loading}
		<span class="font-bold">GGZoeken...</span>
	{:else}
		<div class="flex flex-col md:flex-row gap-2 md:gap-4 items-center">
			<p><span class="font-bold">{count} Resultaten</span> voor uw zoekopdracht</p>
			<SaveSearchButton />
		</div>
	{/if}
</div>


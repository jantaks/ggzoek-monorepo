<script lang="ts">
	import SaveSearchButton from '$lib/components/results-bar/SaveSearchButton.svelte';
	import { MAXRESULTS } from '$lib/constants';
	import Processing from '$lib/components/Processing.svelte';

	type Props = {
		count: number;
		loading: boolean;
	}

	let { count, loading }: Props = $props();
</script>


<div
	class="gap-4 h-fit lg:text-xl text-secondary-900 bg-primary-light rounded-lg py-2 px-4 flex flex-row justify-between items-center mx-1.5 md:mx-0">
	<Processing class="size-8" processing={loading} />
	{#if !loading}
		<p><span class="font-bold">{count} resultaten</span></p>

		{#if count < MAXRESULTS}
			<SaveSearchButton />
		{/if}
	{/if}
</div>
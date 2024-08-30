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


<div class="gap-2 w-full h-fit lg:text-xl">
	<Processing class="size-8" processing={loading} />
	{#if !loading}
		<div class="flex flex-col md:flex-row gap-2 md:gap-4 items-center">
			<p><span class="font-bold">{count} ggzoek resultaten</span></p>
			{#if count < MAXRESULTS}
				<SaveSearchButton />
			{/if}
		</div>
	{/if}
</div>
<script lang="ts">
	import SaveSearchButton from '$lib/components/results-bar/SaveSearchButton.svelte';
	import { MAXRESULTS } from '$lib/constants';

	type Props = {
		count: number;
		loading: boolean;
	}

	let { count, loading }: Props = $props();
</script>


<div class="gap-2 w-full h-fit lg:text-xl">
	{#if loading}
		<span class="font-bold">GGZoeken...</span>
	{:else}
		<div class="flex flex-col md:flex-row gap-2 md:gap-4 items-center">
			<p><span class="font-bold">{count} ggzoek resultaten</span>.
				{#if count > MAXRESULTS}De eerste {MAXRESULTS} worden getoond.{/if}
			</p>
			{#if count < MAXRESULTS}
				<SaveSearchButton />
			{/if}
		</div>
	{/if}
</div>


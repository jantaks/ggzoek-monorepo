<script lang="ts">


	import { Button } from '$lib/components/ui/button/index.js';
	import { DeleteIcon } from 'lucide-svelte';

	let { data } = $props();

	function postcodeDistance(postcode: string, distance: string) {
		if (!distance || !postcode) {
			return postcode;
		}
		return `${postcode} (+/- ${distance} km)`;
	}

</script>

{#snippet row(title, value)}
	<div class="grid grid-cols-2 items-center py-2 text-sm font-light px-2 ">
		<h3 class="truncate capitalize">{title}:</h3>
		<p class="text-wrap truncate uppercase">{value || '' }</p>
	</div>
{/snippet}

{#snippet filterRow(filter)}
	<div class="grid grid-cols-2 items-center py-2 text-sm font-light px-2 ">
		<h3 class="truncate capitalize">{filter.facet}:</h3>
		<p class="uppercase">
			{#each filter.selectedValues as value, index}
				<span class="">{value}</span>
				{#if index < filter.selectedValues.length - 1 }
					<span class="lowercase font-semibold">{filter.operator === "OR" ? "OF " : "EN "}</span>
				{/if}
			{/each}
		</p>
	</div>
{/snippet}


<div class="flex flex-col items-center pt-4 mx-auto">
	<h1 class="text-xl font-bold p-4">U heeft {data.savedSearches.length} bewaarde zoekopdrachten.</h1>
	{#each data.savedSearches as ss}
		<div class="mb-4 p-4 sm:p-4 rounded-lg bg-white md:bg-white text-slate-700 border shadow max-w-xl min-w-96">
			<div class="space-y-2">
				{#if ss.search.query}
					<div class="even:bg-white odd:bg-primary-light/40">
						{@render row("Zoektermen", ss.search.query)}
					</div>
				{/if}
				{#if ss.search.postcode}
					<div class="even:bg-white odd:bg-primary-light/40">
						{@render row("Postcode", postcodeDistance(ss.search.postcode, ss.search.distance))}
					</div>
				{/if}
				{#each ss.search.filters as filter}
					{#if filter.selectedValues.length > 0}
						<div class="even:bg-white/40 odd:bg-primary-light/40">
							{@render filterRow(filter)}
						</div>
					{/if}
				{/each}
			</div>
			<div class="p-4 flex flex-row justify-center">
				<form action="?/deleteSearch" method="POST">
					<input type="hidden" name="search" value={ss.raw} />
					<Button
						class='px-2 h-8 border-primary-light border shadow flex flex-row items-center justify-between font-bold bg-transparent text-slate-900 bg-white hover:border-primary hover:bg-white '
						type="submit"
					>
						<DeleteIcon class={`text-primary size-5 mr-1`}  />
						<span class="text-xs">Verwijder</span>
					</Button>
				</form>
			</div>
		</div>
	{/each}
</div>










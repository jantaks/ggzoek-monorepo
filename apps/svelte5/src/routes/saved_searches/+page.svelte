<script lang="ts">


	import { slide } from 'svelte/transition';
	import { applyAction, enhance } from '$app/forms';
	import { goto, invalidate } from '$app/navigation';
	import { Eye, Trash } from 'lucide-svelte';
	import { DATE_TIME_FORMATTING } from '$lib/constants';

	let { data } = $props();
	let deleting: string[] = [];
	let processing = $state(false);

	function postcodeDistance(postcode: string, distance: number) {
		if (!distance || !postcode) {
			return postcode;
		}
		return `${postcode} (+/- ${distance} km)`;
	}


</script>

{#snippet row(title, value)}
	<div class="grid grid-cols-4 items-center py-2 text-sm font-light px-2 ">
		<h3 class="truncate capitalize">{title}:</h3>
		<p class="col-span-3 w-full text-wrap truncate uppercase">{value || '' }</p>
	</div>
{/snippet}

{#snippet filterRow(filter)}
	<div class="grid grid-cols-4 items-center py-2 text-sm font-light px-2 ">
		<h3 class="truncate capitalize">{filter.facet}:</h3>
		<p class="uppercase col-span-3">
			{#each filter.selectedValues as value, index}
				<span class="">{value}</span>
				{#if index < filter.selectedValues.length - 1 }
					<span class="lowercase font-semibold">{filter.operator === "OR" ? "OF " : "EN "}</span>
				{/if}
			{/each}
		</p>
	</div>
{/snippet}

<div class="mt-4 flex flex-col md:flex-row mx-auto max-w-3xl relative md:pr-4">
	<div class="flex flex-col items-center pt-4 w-full">
		<h1 class="text-xl font-bold p-4 text-center">U heeft {data.savedSearches?.length} bewaarde zoekopdrachten.</h1>
		{#if data.savedSearches}
		{#each data.savedSearches?.filter((s) => !deleting.includes(s.searchUrlParams)) as ss (ss.searchUrlParams)}

			<div class="mb-4 p-2  rounded-lg bg-white md:bg-white text-slate-700 border shadow w-full"
					 out:slide={{axis:"y", duration:300, delay:150}}>
				<div class="space-y-2 pb-2 border-b border-b-gray-300">
					<div class="py-2 text-sm font-semibold px-2 flex flex-row justify-between border-b border-b-gray-300">
						<p class="mr-2">Bewaard op {ss.created.toLocaleDateString("nl-NL", DATE_TIME_FORMATTING)}</p>
						<p class="mr-2">Aantal resultaten: {ss.latestResult.length}</p>
					</div>

					{#if ss.search.query}
						<div class="odd:bg-white even:bg-primary-light/40">
							{@render row("Zoektermen", ss.search.query)}
						</div>
					{/if}
					{#if ss.search.postcode}
						<div class="odd:bg-white even:bg-primary-light/40">
							{@render row("Postcode", postcodeDistance(ss.search.postcode, ss.search.distance))}
						</div>
					{/if}
					{#each ss.search.filters as filter}
						{#if filter.selectedValues.length > 0}
							<div class="odd:bg-white even:bg-primary-light/40">
								{@render filterRow(filter)}
							</div>
						{/if}
					{/each}
				</div>
				<div class="p-4 flex flex-row justify-center">
					<form action="?/delete"
								method="POST"
								use:enhance={() => {
					deleting = [...deleting, ss.searchUrlParams];
					processing = true
					return async ( {result}) => {
						if (result.type === "redirect") {
							await goto(result.location);
						}

						deleting = deleting.filter((id) => id !== ss.searchUrlParams);
						await applyAction(result);
						await invalidate('data:root');
						processing = false
					};
				}}>
						<input type="hidden" name="search" value={ss.searchUrlParams} />
						<div class="flex flex-row gap-4">
							<button
								class='group w-28 px-2 h-8 rounded-lg border-primary-light border hover:fill-primary shadow flex flex-row items-center justify-between font-bold bg-transparent text-slate-900 bg-white hover:border-primary hover:bg-white '
								type="submit"
								disabled={processing}
							>
								<span class="text-xs ">Verwijder</span>
								<Trash class={`transition ease-in-out text-primary size-4  group-hover:scale-125`} />
							</button>
							<a href="/zoekresultaten?{ss.searchUrlParams}"
								 class='group w-28 px-2 h-8 rounded-lg border-primary-light border shadow flex flex-row items-center justify-between font-bold bg-transparent text-slate-900 bg-white hover:border-primary hover:bg-white '
								 type="submit"
							>
								<span class="text-xs">Bekijk ({ss.latestResult.length})</span>
								<Eye class={`transition ease-in-out text-primary size-4  group-hover:scale-125`} />
							</a>
						</div>
					</form>
				</div>
			</div>
		{/each}
		{/if}
	</div>
</div>










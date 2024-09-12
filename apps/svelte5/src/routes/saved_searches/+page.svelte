<script lang="ts">


	import { slide } from 'svelte/transition';
	import { applyAction, enhance } from '$app/forms';
	import { goto, invalidate } from '$app/navigation';
	import { Eye, Trash } from 'lucide-svelte';
	import { DATE_TIME_FORMATTING, DATE_TIME_SHORT } from '$lib/constants';
	import Button3 from '$lib/components/ui/button/Button3.svelte';

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
	<div class="grid grid-cols-4 items-center py-1 test-base font-base px-2 ">
		<h3 class="truncate capitalize">{title}:</h3>
		<p class="col-span-3 w-full text-wrap truncate uppercase">{value || '' }</p>
	</div>
{/snippet}

{#snippet filterRow(filter)}
	<div class="grid grid-cols-4 items-center py-1 test-base font-base px-2 ">
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

				<div class="mb-4 p-2  rounded-lg bg-primary-200 md:bg-primary-200 text-slate-700 border shadow w-full"
						 out:slide={{axis:"y", duration:300, delay:150}}>
					<div class="space-y-2 pb-2 border-b border-b-gray-300">
						<div class="py-2 test-base font-semibold px-2 flex flex-row justify-between border-b border-b-gray-300">
							<p class="mr-2">Bewaard: {ss.created.toLocaleDateString("nl-NL", DATE_TIME_SHORT)}</p>
							<p class="mr-2">Resultaten: {ss.latestResult.length}</p>
						</div>

						{#if ss.search.query}
							<div class="odd:bg-primary-200 even:bg-primary/50">
								{@render row("Zoektermen", ss.search.query)}
							</div>
						{/if}
						{#if ss.search.postcode}
							<div class="odd:bg-primary-200 even:bg-primary/50">
								{@render row("Postcode", postcodeDistance(ss.search.postcode, ss.search.distance))}
							</div>
						{/if}
						{#each ss.search.filters as filter}
							{#if filter.selectedValues.length > 0}
								<div class="odd:bg-primary-200 even:bg-primary/50">
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
								<Button3
									variant="primary"
									type="submit"
									disabled={processing}
									icon={Trash}
								>
									<span class="text-xs ">Verwijder</span>
								</Button3>
								<Button3 variant="primary" icon="{Eye}">
									<a href="/zoekresultaten?{ss.searchUrlParams}">
										<span class="text-xs">Bekijk ({ss.latestResult.length})</span>
									</a>
								</Button3>


							</div>
						</form>
					</div>
				</div>
			{/each}
		{/if}
	</div>
</div>










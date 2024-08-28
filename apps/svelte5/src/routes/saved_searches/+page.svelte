<script lang="ts">


	import { slide } from 'svelte/transition';
	import { applyAction, enhance } from '$app/forms';
	import { goto, invalidate } from '$app/navigation';
	import { Eye, Trash } from 'lucide-svelte';

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

<div class="mt-4 flex flex-col md:flex-row mx-auto max-w-3xl relative md:pr-4">
	<div class="flex flex-col items-center pt-4 w-full">
		<h1 class="text-xl font-bold p-4">U heeft {data.savedSearches.length} bewaarde zoekopdrachten.</h1>
		{#each data.savedSearches.filter((s) => !deleting.includes(s.raw)) as ss (ss.raw)}
			<div class="mb-4 p-4 sm:p-4 rounded-lg bg-white md:bg-white text-slate-700 border shadow w-full"
					 out:slide={{axis:"y", duration:300, delay:150}}>
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
					<form action="?/delete"
								method="POST"
								use:enhance={() => {
					deleting = [...deleting, ss.raw];
					processing = true
					return async ( {result}) => {
						if (result.type === "redirect") {
							await goto(result.location);
						}

						deleting = deleting.filter((id) => id !== ss.raw);
						await applyAction(result);
						await invalidate('data:root');
						processing = false
					};
				}}>
						<input type="hidden" name="search" value={ss.raw} />
						<div class="flex flex-row gap-4">
							<button
								class='group w-28 px-2 h-8 rounded-lg border-primary-light border hover:fill-primary shadow flex flex-row items-center justify-between font-bold bg-transparent text-slate-900 bg-white hover:border-primary hover:bg-white '
								type="submit"
								disabled={processing}
							>
								<span class="text-xs ">Verwijder</span>
								<Trash class={`transition ease-in-out text-primary size-4  group-hover:scale-125`} />
							</button>
							<a href="/zoekresultaten?{ss.raw}"
								 class='group w-28 px-2 h-8 rounded-lg border-primary-light border shadow flex flex-row items-center justify-between font-bold bg-transparent text-slate-900 bg-white hover:border-primary hover:bg-white '
								 type="submit"
							>
								<span class="text-xs">Bekijk</span>
								<Eye class={`transition ease-in-out text-primary size-4  group-hover:scale-125`} />
							</a>
						</div>
					</form>
				</div>
			</div>
		{/each}
	</div>
</div>










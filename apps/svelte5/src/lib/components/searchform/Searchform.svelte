<script lang="ts">
	import { type facet } from '$lib/types';
	import type { getFacets } from '$lib/search';
	import { Label, Slider } from 'bits-ui';
	import FacetSelectFilterNew from '$lib/components/searchform/FacetSelectFilterNew.svelte';
	import PostCodeSelect from '$lib/components/searchform/PostCodeSelect.svelte';
	import SearchBox from '$lib/components/searchform/SearchBox.svelte';
	import { ChevronDown, ChevronUp } from 'lucide-svelte';
	import { page } from '$app/stores';
	import { slide } from 'svelte/transition';

	const x = { Slider, Label };

	$effect(() => {
		$page.data;
		toggleOn = false;
	});


	type Props = {
		facets: Awaited<ReturnType<typeof getFacets>>,
	}

	let { facets }: Props = $props();

	let allFacets = Object.keys(facets) as facet[];

	let innerWidth: number = $state(0);
	let toggleOn = $state(false);
	let showFilters = $derived(innerWidth > 768 || toggleOn);


</script>

<svelte:window bind:innerWidth />

<div
	class="px-2 py-4 md:pt-0.5 md:p-4 space-y-2 sm:space-y-4 justify-left bg-primary md:rounded-xl shadow-xl text-primary-light">
	<div class="md:hidden">
		<SearchBox />
	</div>
	<div class={`space-y-2 sm:space-y-4 ${showFilters? "": "hidden"} `} transition:slide>
		<PostCodeSelect></PostCodeSelect>

		{#each allFacets as facet (facet)}
			<FacetSelectFilterNew facets={facets[facet]}
														filterLabel={facet}></FacetSelectFilterNew>
		{/each}
	</div>
</div>
{#if innerWidth < 768}
	<div class="flex flex-row mx-auto rounded-b-xl bg-primary w-fit px-2 text-white font-bold">

		<button onclick={() => toggleOn = !toggleOn}
						class="w-full flex flex-row text-primary-light justify-center items-center text-sm">
			{#if !showFilters}
				Uitgebreid zoeken
				<ChevronDown
					class="size-8 text-white transform hover:scale-125 transition duration-500 ease-in-out" />
			{:else}
				<ChevronUp
					class="size-8 text-white transform hover:scale-125 transition duration-500 ease-in-out" />
			{/if}
		</button>
	</div>
{/if}

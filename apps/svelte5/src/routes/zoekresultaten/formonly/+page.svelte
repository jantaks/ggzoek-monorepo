<script lang="ts">

	import PostCodeSelect from '$lib/components/searchform/PostCodeSelect.svelte';
	import SearchBox from '$lib/components/searchform/SearchBox.svelte';
	import FilterContainer from '$lib/components/searchform/FilterContainer.svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { getSearchForm } from '$lib/stores/formStore.svelte';
	import { fade, slide, fly, blur, scale } from 'svelte/transition';

	let form = getSearchForm();
	let { data } = $props();
	console.log('DATAPROPS', data, data.facets);
	form.initiate($page.url.searchParams);


</script>
<svelte:head>
	<style>
      body {
          @apply bg-secondary-900/10 md:bg-primary;
          /*@apply overflow-hidden*/
      }
	</style>
</svelte:head>

<div class="h-[calc(87dvh)] flex flex-col justify-between">
	<div class="bg-primary px-2 py-4">
		<SearchBox />
	</div>
	<div
		class="p-4 justify-left text-primary-light space-y-6 flex flex-col">

		<div class="space-y-6 sm:space-y-4 text-secondary-900">
			<PostCodeSelect></PostCodeSelect>
			<hr class="h-1 bg-secondary-900/20">
			<FilterContainer facets={data.facets}></FilterContainer>
			<!--			<hr>-->
		</div>
		<hr class="h-1 bg-secondary-900/20">
	</div>

	{#if data.searchResponse.estimatedTotalHits > 0}
		{#key data.searchResponse.estimatedTotalHits}
			<div class="flex justify-center p-4 w-full">
				<div class="rounded text-white text-center font-semibold p-3 w-full bg-secondary-900 scale">
					<a href={`/zoekresultaten?${$page.url.searchParams}`}>
						Toon {data.searchResponse.estimatedTotalHits} vacatures.
					</a>
				</div>
			</div>
		{/key}
	{:else}
		{#key data.searchResponse.estimatedTotalHits}
			<div class="flex justify-center p-4 w-full">
				<div class="rounded text-white text-center font-semibold p-3 w-full bg-gray-400 scale">
					<div>
						Geen resultaten.
					</div>
				</div>
			</div>
		{/key}
	{/if}
</div>

<style>

    .scale {
        animation: scale 0.7s ease-in-out;
    }

    @keyframes scale {
        0% {
            transform: scale(0.9);
            opacity: 0.7;
        }
        100% {
            transform: scale(1);
        }
    }

</style>



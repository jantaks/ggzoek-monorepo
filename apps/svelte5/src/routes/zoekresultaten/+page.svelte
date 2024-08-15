<script lang="ts">
	import Searchform from '$lib/components/searchform/Searchform.svelte';
	import FilterBar from '$lib/components/results-bar/FilterBar.svelte';
	import NavBar from '$lib/components/navbar/NavBar.svelte';
	import VacatureCard from '$lib/components/vacature-card/VacatureCard.svelte';
	import ResultsBar from '$lib/components/results-bar/ResultsBar.svelte';
	import { getSearchForm } from '$lib/stores/formStore.svelte.js';
	import Paginator from '$lib/components/pagination/Paginator.svelte';
	import { page } from '$app/stores';

	let { data } = $props();

	let form = getSearchForm();
	form.initiate($page.url.searchParams);

</script>
<svelte:head>
	<style>
      body {
          @apply bg-gradient-to-r from-secondary-300 via-primary-light to-white;
      }
	</style>
</svelte:head>

<NavBar class="mb-4 bg-secondary-900 text-white h-14" showLinks showLogin></NavBar>
<div class="flex flex-col md:flex-row mx-auto max-w-7xl relative md:pr-4">
	<div class="hidden md:block md:w-2/5 min-w-fit">
		<Searchform facets={data.facets}></Searchform>
	</div>
	<div class="md:ml-4 w-full gap-3 flex flex-col lg:w-3/5">

		<label class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white" for="default-search">Zoeken</label>
		<div class="relative">
			<div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
				<svg aria-hidden="true" class="w-4 h-4 text-secondary dark:text-gray-400" fill="none"
						 viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
					<path d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" stroke="currentColor" stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="3" />
				</svg>
			</div>
			<input
				bind:value={form.query}
				class="glowing border-primary-light block w-full p-4 ps-10 text-sm text-gray-900 border md:rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
				id="default-search"
				placeholder="Zoek tekst, beroep, locatie, ..."
				required type="search" />
		</div>

		<div class="md:hidden md:w-2/5 min-w-fit">
			<Searchform class="rounded-none md:rounded-2xl px-2 py-4 md:p-1.5" facets={data.facets}></Searchform>
		</div>
		<FilterBar />
		<ResultsBar count={data.searchResponse.estimatedTotalHits} loading={form.isLoading} />
		<div class="space-y-4">
			{#each data.searchResponse.hits as hit}
				<VacatureCard hit={hit}></VacatureCard>
			{/each}
		</div>
		<div class="mx-auto">
			<Paginator searchResponse={data.searchResponse}></Paginator>
		</div>
	</div>

</div>

<style>
    .glowing {
        animation: glow 1200ms ease-out infinite alternate;
    }

    @keyframes glow {
        0% {
            box-shadow: 0 0 0px #F17EB8, inset 0 0 0, 0 0 0 #ea8bfc;
        }
        100% {
            box-shadow: 0 0 5px #F17EB8, inset 0 0 0, 0 0 0 #ea8bfc;
        }
    }
</style>





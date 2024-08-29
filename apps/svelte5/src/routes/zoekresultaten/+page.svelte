<script lang="ts">
	import Searchform from '$lib/components/searchform/Searchform.svelte';
	import FilterBar from '$lib/components/results-bar/FilterBar.svelte';
	import VacatureCard from '$lib/components/vacature-card/VacatureCard.svelte';
	import ResultsBar from '$lib/components/results-bar/ResultsBar.svelte';
	import { getSearchForm } from '$lib/stores/formStore.svelte.js';
	import Paginator from '$lib/components/pagination/Paginator.svelte';
	import { page } from '$app/stores';
	import SearchBox from '$lib/components/searchform/SearchBox.svelte';

	let { data } = $props();

	let vacatureList = $state<HTMLElement | null>(null);

	$inspect(vacatureList);

	let form = getSearchForm();
	form.initiate($page.url.searchParams);
	let h = $state(0);
	let y = $state(0);

	$effect(() => {
		const handleScroll = () => {
			if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 5) {
				console.log('Scrolled to the end of the page');
			}
		};

		window.addEventListener('scroll', handleScroll);
		return () => {
			window.removeEventListener('scroll', handleScroll);
		};
	});


</script>
<svelte:head>
	<style>
      body {
          @apply bg-secondary-100 md:bg-gradient-to-r from-secondary-300 via-primary-light to-white;
      }
	</style>
</svelte:head>
<svelte:window bind:innerHeight={h} bind:scrollY={y} />

<div bind:this={vacatureList} class="md:mt-4 flex flex-col md:flex-row mx-auto max-w-7xl relative md:pr-4">
	<div class="hidden md:block md:w-2/5 min-w-fit">
		<Searchform facets={data.facets}></Searchform>
	</div>
	<div class="md:ml-4 w-full gap-3 flex flex-col lg:w-3/5">
		<div class="hidden md:block">
			<SearchBox />
		</div>

		<div class="md:hidden md:w-2/5 min-w-fit">
			<Searchform facets={data.facets}></Searchform>
		</div>
		<FilterBar />
		<ResultsBar count={data.searchResponse.estimatedTotalHits} loading={form.isLoading} />
		<div class="space-y-4">
			{#each data.searchResponse.hits as hit (hit.urlHash)}
				<VacatureCard hit={hit}></VacatureCard>
			{/each}
		</div>
		<div class="mx-auto">
			<Paginator searchResponse={data.searchResponse}></Paginator>
		</div>
	</div>

</div>






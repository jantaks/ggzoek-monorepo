<script lang="ts">
	import { getSearchForm } from '$lib/stores/formStore.svelte.js';
	import { page } from '$app/stores';
	import Searchform from '$lib/components/searchform/Searchform.svelte';
	import SearchBox from '$lib/components/searchform/SearchBox.svelte';
	import FilterBar from '$lib/components/results-bar/FilterBar.svelte';
	import ResultsBar from '$lib/components/results-bar/ResultsBar.svelte';
	import VacatureCard from '$lib/components/vacature-card/VacatureCard.svelte';
	import Processing from '$lib/components/Processing.svelte';
	import { MAXRESULTS } from '$lib/constants';
	import BackToTop from './BackToTop.svelte';
	import { tick } from 'svelte';

	let { data } = $props();

	let hits = $state(data.searchResponse.hits);
	let offset = $state(0);
	let lastInView = $state(false);
	let inView = $state<Set<number>>(new Set());
	let navMessage = $state('');
	let loading = $state(false);
	let initialHitsLoaded = $derived(data.searchResponse.hits);
	let form = getSearchForm();


	form.initiate($page.url.searchParams);

	async function getVacatures() {
		offset += 5;
		$page.url.searchParams.set('offset', String(offset));
		const response = await fetch(`/zoekresultaten/api?${$page.url.searchParams.toString()}`).then(res => res.json());
		if (response.message) {
			return [];
		}
		return response.searchResponse.hits;
	}


	const onscroll = async () => {
		let endOfPage = window.innerHeight + window.scrollY >= document.body.offsetHeight - 10;
		if (endOfPage && !loading && !lastInView) {
			loading = true;
			const nHits = await getVacatures();
			if (nHits?.length > 0) {
				hits = [...hits, ...nHits];
			}
			loading = false;
		}
	};

	$effect(() => {
		hits = initialHitsLoaded;
		lastInView = false;
		offset = 0;
	});

	let resultsShown = $derived<number|undefined>(data.searchResponse.estimatedTotalHits! < MAXRESULTS ?
		data.searchResponse.estimatedTotalHits
		:
		MAXRESULTS);

	async function onEnter(index: number) {
		if (index === MAXRESULTS - 1 || data.searchResponse.estimatedTotalHits === index + 1) {
			lastInView = true;
		}
		console.log('onEnter', index);
		const newSet = inView.add(index);
		inView = new Set(newSet);
		navMessage = `${Math.min(...inView) + 1} - ${Math.max(...inView) + 1} van ${resultsShown}`;
		await tick();
	}

	async function onExit(index: number) {
		if (index === MAXRESULTS - 1 || data.searchResponse.estimatedTotalHits === index + 1) {
			lastInView = false;
		}
		inView.delete(index);
	}

	let allLoadedMessage = $derived(data!.searchResponse!.estimatedTotalHits! < MAXRESULTS ?
		`Alle ${data.searchResponse.estimatedTotalHits} resultaten geladen`
		:
		`${MAXRESULTS} meeste relevante resultaten geladen`);

</script>
<svelte:head>
	<style>
      body {
          @apply bg-secondary-100 md:bg-gradient-to-r from-secondary-300 via-primary-light to-white;
      }
	</style>
</svelte:head>
<svelte:window onscroll={onscroll}></svelte:window>
<div class="md:mt-4 flex flex-col md:flex-row mx-auto max-w-7xl relative md:pr-4">
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
		<div class="space-y-4 relative">
			{#each hits as hit, index (hit.urlHash) }
				<VacatureCard
					hit={hit}
					onEnter={() => onEnter(index)}
					onExit={() => onExit(index)}></VacatureCard>
			{/each}
			{@render navigation()}
		</div>

		<Processing class="size-8" processing={loading}></Processing>
	</div>
</div>


{#snippet navigation()}
	<BackToTop
	message = {lastInView? allLoadedMessage : navMessage}
	tailwindBgColor = {lastInView? "bg-secondary-900" : "bg-primary"}
	/>
{/snippet    }






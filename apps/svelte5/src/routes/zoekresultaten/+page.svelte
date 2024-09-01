<script lang="ts">
	import { getSearchForm } from '$lib/stores/formStore.svelte.js';
	import { page } from '$app/stores';
	import { browser } from '$app/environment';
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
	let loadHits = $derived(data.searchResponse.hits);
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


	const handleInfiniteScroll = async () => {
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
		console.log('Effect 1');
		if (browser) {
			window.addEventListener('scroll', handleInfiniteScroll);
		}
		return () => {
			console.log('remove event listener');
			window.removeEventListener('scroll', handleInfiniteScroll);
		};
	});

	$effect(() => {
		console.log('Effect 2');
		hits = loadHits;
		lastInView = false;
		offset = 0;
	});


	function updateMessage() {
		navMessage = `${Math.min(...inView) + 1} - ${Math.max(...inView) + 1}`;
	}

	async function onEnter(index: number) {
		if (index === MAXRESULTS - 1 || data.searchResponse.estimatedTotalHits === index + 1) {
			lastInView = true;
		}
		console.log('onEnter', index);
		const newSet = inView.add(index);
		inView = new Set(newSet);
		updateMessage();
		await tick();
	}

	async function onExit(index: number) {
		if (index === MAXRESULTS - 1 || data.searchResponse.estimatedTotalHits === index + 1) {
			lastInView = false;
		}
		console.log('onExit', index);
		inView.delete(index);
		updateMessage();
		await tick();
	}


</script>
<svelte:head>
	<style>
      body {
          @apply bg-secondary-100 md:bg-gradient-to-r from-secondary-300 via-primary-light to-white;
      }
	</style>
</svelte:head>

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
	{#if !lastInView}
		<BackToTop message={navMessage}
							 class="bg-primary"
							 scrollingClass="bg-primary/50" />

	{:else}
		<BackToTop
			message={`${Math.max(...inView) + 1} meest relevante resulaten geladen. Verfijn uw zoekcriteria als u niet hebt gevonden wat u zocht`}
			class="bg-secondary-900"
			scrollingClass="bg-secondary-900/70" />
	{/if}
{/snippet  }






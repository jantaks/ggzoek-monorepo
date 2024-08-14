<script lang="ts">
	import Searchform from '$lib/components/searchform/Searchform.svelte';
	import FilterBar from '$lib/components/results-bar/FilterBar.svelte';
	import NavBar from '$lib/components/navbar/NavBar.svelte';
	import VacatureCard from '$lib/components/vacature-card/VacatureCard.svelte';
	import ResultsBar from '$lib/components/results-bar/ResultsBar.svelte';
	import { getSearchForm } from '$lib/stores/formStore.svelte.js';
	import { Input } from '$lib/components/ui/input';
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
<div class="flex flex-col sm:flex-row mx-auto max-w-7xl relative space-y-4 sm:space-y-0">
	<div class="sm:w-2/5 min-w-fit">
		<Searchform facets={data.facets}></Searchform>
	</div>
	<div class="sm:ml-4 w-full space-y-4">
		<Input bind:value={form.query} class="mb-4 border border-primary-light h-14" id="name"
					 onchange={() => form.submit()}
					 placeholder="Zoekcriteria invoeren"
					 required
					 type="text"
		/>
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






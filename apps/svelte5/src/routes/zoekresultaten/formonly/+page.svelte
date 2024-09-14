<script lang="ts">

	import PostCodeSelect from '$lib/components/searchform/PostCodeSelect.svelte';
	import SearchBox from '$lib/components/searchform/SearchBox.svelte';
	import FilterContainer from '$lib/components/searchform/FilterContainer.svelte';
	import { page } from '$app/stores';
	import { getSearchForm } from '$lib/stores/formStore.svelte';
	import ResultButton from '$lib/components/searchform/ResultButton.svelte';

	let form = getSearchForm();
	let { data } = $props();
	form.initiate($page.url.searchParams);


</script>
<svelte:head>
	<style>
      body {
          @apply bg-grijs;
      }
	</style>
</svelte:head>

<div class="flex flex-col justify-between w-full">
	<div class="bg-primary p-4">
		<SearchBox />
	</div>

	<div
		class="p-4 justify-left text-primary-light space-y-6 flex flex-col">
		<div class="space-y-6 sm:space-y-4 text-secondary-900">
			<PostCodeSelect></PostCodeSelect>
			<hr class="h-0.5 bg-secondary-900 border-none">
			<FilterContainer facets={data.facets}></FilterContainer>
		</div>
		<hr class="h-0.5 bg-secondary-900 border-none">
		<ResultButton
			href={`/zoekresultaten?${$page.url.searchParams}`}
			isLoading={form.isLoading}
			totalHits={data.searchResponse.estimatedTotalHits}
		/>
	</div>
</div>

<style></style>



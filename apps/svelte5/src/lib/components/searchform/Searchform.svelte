<script lang="ts">
  import type { SearchResponse } from 'meilisearch';
  import FacetSelectFilter from '$lib/components/searchform/FacetSelectFilter.svelte';
  import { filterStore, formStore } from '$lib/stores/stores.svelte.js';
  import { page } from '$app/stores';
  import { type facet } from '$lib/types';
  import type { getFacets } from '$lib/components/searchform/search';
  import Bin from '$lib/components/icons/Bin.svelte';
  import { Button } from '$lib/components/ui/button';
  import { tick } from 'svelte';

  type Props = {
    searchResponse?: SearchResponse,
    facets: Awaited<ReturnType<typeof getFacets>>,
    class?: string
  }

  let { searchResponse, class: className, facets }: Props = $props();

  function removeAllFilters() {
    filterStore.removeAll();
    console.log('Remove all filters');
    tick().then(formStore.submit);
  }

  // eslint-disable-next-line svelte/valid-compile
  $page.url.searchParams.forEach((value, key) => {
    if (Object.keys(facets).includes(key as facet)) {
      try {
        let values = JSON.parse(value) as string[];
        filterStore.filters[key] = values.map((v) => ({ value: v, label: v }));
      } catch {
        console.error('Could not parse filter value');
      }
    }
  });

  let allFacets = Object.keys(facets) as facet[];

</script>

<form class={"bg-pink-100 p-4 space-y-4 justify-left " + className} title="searchform" use:formStore.set>
  <div class=" space-y-4">
    {#if filterStore.filterCount() > 0}
      <Button class='flex flex-row justify-between h-8 uppercase text-xs bg-pink-500'>
        Verwijder filters
        <Bin onclick={() => removeAllFilters()} class="size-4  ml-1" />
      </Button>
    {/if}
    {#each allFacets as facet}
      {#if searchResponse?.facetDistribution}
        <FacetSelectFilter categoryDistribution={searchResponse.facetDistribution[facet]}
                           facets={facets[facet]}
                           filterLabel={facet}></FacetSelectFilter>
      {/if}
    {/each}
  </div>
  <input name="filters" type="hidden" value={filterStore.getAllFilterExpressions()} />
</form>
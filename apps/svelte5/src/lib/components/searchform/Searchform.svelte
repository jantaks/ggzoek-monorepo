<script lang="ts">
  import { Input } from '$lib/components/ui/input';
  import { Button } from '$lib/components/ui/button';
  import type { SearchResponse } from 'meilisearch';
  import FacetSelectFilter from '$lib/components/searchform/FacetSelectFilter.svelte';
  import { filterStore, formStore } from '$lib/stores/stores.svelte.js';
  import { page } from '$app/stores';
  import { type facet, facets } from '$lib/types';

  type Props = {
    searchResponse?: SearchResponse
  }

  let { searchResponse }: Props = $props();

  let showFilters = $state(true);


  // eslint-disable-next-line svelte/valid-compile
  $page.url.searchParams.forEach((value, key) => {
    if (facets.includes(key as facet)) {
      try {
        let values = JSON.parse(value) as string[];
        filterStore.filters[key] = values.map((v) => ({ value: v, label: v }));
      } catch {
        console.error('Could not parse filter value');
      }
    }
  });

</script>

<form class="bg-yellow-300 p-4 space-y-4 max-w-xs flex flex-col  justify-left w-full" use:formStore.set>

  <Input class="max-w-xs" name="fullText" placeholder="Zoek een vacature" />
  <Button
    onclick={()=> showFilters = !showFilters}>{showFilters ? 'Filters verbergen' : 'Filters weergeven'}</Button>
  <div class="{showFilters? 'display': 'hidden'} space-y-4">
    {#if searchResponse?.facetDistribution}
      {#each Object.keys(searchResponse.facetDistribution) as facet}
        <FacetSelectFilter categoryDistribution={searchResponse.facetDistribution[facet]}
                           facet={facet}></FacetSelectFilter>
      {/each}
    {/if}
  </div>


  <Button onclick={formStore.submit}>Zoek</Button>
</form>
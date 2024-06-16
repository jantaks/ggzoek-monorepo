<script lang="ts">
  import { Input } from '$lib/components/ui/input';
  import { Button } from '$lib/components/ui/button';
  import type { SearchResponse } from 'meilisearch';
  import FacetSelectFilter from '$lib/components/searchform/FacetSelectFilter.svelte';
  import { page } from '$app/stores';
  import { type facet, facets } from '$lib/types';

  type Props = {
    result?: SearchResponse
  }

  let { result }: Props = $props();
  let form: HTMLFormElement;

  let showFilters = $state(true);

  function onFiltersChanged(facet: string, selectedValues: string[]) {
    if (!filterTags[facet]) filterTags[facet] = [];
    filterTags[facet].splice(0, filterTags[facet].length);
    filterTags[facet].push(...selectedValues);
    form.requestSubmit();
  }

  function removeFilter(facet: string, value: string) {
    return () => {
      filterTags[facet] = filterTags[facet].filter((v) => v !== value);
      form.requestSubmit();
    };
  }

  let filterTags = $state<Record<string, string[]>>({});

  $page.url.searchParams.forEach((value, key) => {
    if (facets.includes(key as facet)) {
      filterTags[key] = JSON.parse(value) as string[];
    }
  });


</script>

<form bind:this={form} class="bg-yellow-300 p-4 space-y-4 max-w-xs flex flex-col  justify-left w-full">
  {#each Object.keys(filterTags) as tag}
    {#each filterTags[tag] as value}
      <Button class='p-4 flex flex-row justify-between'>
        {value}
        <button onclick={removeFilter(tag, value)}>X</button>
      </Button>
    {/each}
  {/each}
  <Input class="max-w-xs" name="fullText" placeholder="Zoek een vacature" />
  <Button
    onclick={()=> showFilters = !showFilters}>{showFilters ? 'Filters verbergen' : 'Filters weergeven'}</Button>
  <div class="{showFilters? 'display': 'hidden'} space-y-4">
    {#if result?.facetDistribution}
      {#each Object.keys(result.facetDistribution) as facet}
        <FacetSelectFilter onChanged={onFiltersChanged} categoryDistribution={result.facetDistribution[facet]}
                           facet={facet} selectedValues={filterTags[facet]}></FacetSelectFilter>
      {/each}
    {/if}
  </div>


  <Button type="submit">Zoek</Button>
</form>
<script lang="ts">
  import { Input } from '$lib/components/ui/input';
  import { Button } from '$lib/components/ui/button';
  import type { SearchResponse } from 'meilisearch';
  import FacetSelectFilter from '$lib/components/searchform/FacetSelectFilter.svelte';

  type Props = {
    result?: SearchResponse
  }

  let { result }: Props = $props();
  let form: HTMLFormElement;

  let showFilters = $state(true);

  $effect(() => {
    console.log('rendererd');
  });

  function onFiltersChanged() {
    console.log('filters changed');
    form.requestSubmit();
  }


</script>

<form bind:this={form} class="bg-yellow-300 p-4 space-y-4 max-w-xs flex flex-col  justify-left w-full">
  <Input class="max-w-xs" name="fullText" placeholder="Zoek een vacature" />
  <Button
    onclick={()=> showFilters = !showFilters}>{showFilters ? 'Filters verbergen' : 'Filters weergeven'}</Button>
  <div class="{showFilters? 'display': 'hidden'} space-y-4">
    {#if result?.facetDistribution}
      {#each Object.keys(result.facetDistribution) as facet}
        <FacetSelectFilter onChanged={onFiltersChanged} categoryDistribution={result.facetDistribution[facet]}
                           facet={facet}></FacetSelectFilter>
      {/each}
    {/if}
  </div>


  <Button type="submit">Zoek</Button>
</form>
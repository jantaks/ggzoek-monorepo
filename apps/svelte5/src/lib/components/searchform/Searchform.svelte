<script lang="ts">
  import { Input } from '$lib/components/ui/input';
  import { Button } from '$lib/components/ui/button';
  import type { CategoriesDistribution } from 'meilisearch';
  import FacetSelectFilter from '$lib/components/searchform/FacetSelectFilter.svelte';

  type Props = {
    beroepen?: CategoriesDistribution
    stoornissen?: CategoriesDistribution
  }

  let { beroepen, stoornissen }: Props = $props();

  let showFilters = $state(true);


</script>

<form class="bg-yellow-300 p-4 space-y-4 max-w-xs flex flex-col  justify-left w-full">
  <Input class="max-w-xs" name="fullText" placeholder="Zoek een vacature" />
  <Button
    onclick={()=> showFilters = !showFilters}>{showFilters ? 'Filters verbergen' : 'Filters weergeven'}</Button>
  {#if showFilters}
    {#if beroepen}
      <FacetSelectFilter categoryDistribution={beroepen} facet="beroepen"></FacetSelectFilter>
    {/if}
    {#if stoornissen}
      <FacetSelectFilter categoryDistribution={stoornissen} facet="stoornissen"></FacetSelectFilter>
    {/if}
  {/if}

  <Button type="submit">Zoek</Button>
</form>
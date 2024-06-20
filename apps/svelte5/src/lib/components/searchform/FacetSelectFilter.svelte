<script lang="ts">
  import { Content, Select, SelectItem, Trigger } from '$lib/components/ui/select/index.js';
  import type { Selected } from 'bits-ui';
  import type { CategoriesDistribution, FacetHit } from 'meilisearch';
  import { filterStore, formStore } from '$lib/stores/stores.svelte.js';
  import { tick } from 'svelte';
  import { type facet } from '$lib/types';


  type Props = {
    facets: FacetHit[]
    filterLabel: facet,
    categoryDistribution: CategoriesDistribution
  }

  let { categoryDistribution, filterLabel, facets }: Props = $props();

  function updateSelection(event: Selected<string>[] | undefined) {
    if (event) {
      filterStore.addAll(filterLabel, event);
      tick().then(formStore.submit);
    }
  }

  function serialiseSelected(selected: Selected<string>[]) {
    return JSON.stringify(selected.map((s) => s.value));
  }


</script>

<Select
  bind:selected={filterStore.filters[filterLabel]}
  multiple
  onSelectedChange={updateSelection}
  typeahead>
  <Trigger class="w-full">
    {filterStore.filters[filterLabel].length ? `${filterLabel}: ${filterStore.filters[filterLabel].length}  geselecteerd` : `Selecteer ${filterLabel}`}
  </Trigger>
  <Content>
    {#each facets as facet}
      <SelectItem value={facet.value}>
        {`${facet.value} (${categoryDistribution[facet.value] || '0'})`}
      </SelectItem>
    {/each}
  </Content>
</Select>
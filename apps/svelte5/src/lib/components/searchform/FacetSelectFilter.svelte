<script lang="ts">
  import { Content, Select, SelectItem, Trigger } from '$lib/components/ui/select/index.js';
  import { Input } from '$lib/components/ui/input/index.js';
  import type { Selected } from 'bits-ui';
  import type { CategoriesDistribution } from 'meilisearch';
  import { filterStore } from '$lib/components/searchform/filters.svelte';
  import { tick } from 'svelte';


  type Props = {
    onChanged: () => void,
    facet: string,
    categoryDistribution: CategoriesDistribution
  }

  let { categoryDistribution, facet, onChanged }: Props = $props();

  let open = $state(false);

  function updateSelection(event: Selected<string>[] | undefined) {
    if (event) {
      filterStore.filters[facet] = event;
      open = false;
      tick().then(onChanged);
    }
  }

  function serialiseSelected(selected: Selected<string>[]) {
    return JSON.stringify(selected.map((s) => s.value));
  }


</script>

<Select
  bind:open={open}
  bind:selected={filterStore.filters[facet]}
  multiple
  onSelectedChange={updateSelection}
  typeahead>
  <Trigger class="w-full">
    {filterStore.filters[facet].length ? `${facet}: ${filterStore.filters[facet].length}  geselecteerd` : `Selecteer ${facet}`}
  </Trigger>
  <Content>
    {#each Object.keys(categoryDistribution) as category}
      <SelectItem value={category}>
        {`${category} (${categoryDistribution[category]})`}
      </SelectItem>
    {/each}
  </Content>
</Select>
<Input name={facet} type="hidden" value={serialiseSelected(filterStore.filters[facet])} />
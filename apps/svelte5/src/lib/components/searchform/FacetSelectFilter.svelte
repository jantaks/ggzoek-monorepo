<script lang="ts">
  import { Content, Select, SelectItem, Trigger } from '$lib/components/ui/select/index.js';
  import { Input } from '$lib/components/ui/input/index.js';
  import type { Selected } from 'bits-ui';
  import type { CategoriesDistribution } from 'meilisearch';
  import { tick } from 'svelte';
  import { page } from '$app/stores';


  let selectedValues = $state<string[]>([]);

  let selections = $derived.by(() => {
    return selectedValues.map(s => {
      return { 'value': s };
    });
  });

  type Props = {
    onChanged: (facet: string, selectedValues: string[]) => void,
    facet: string,
    categoryDistribution: CategoriesDistribution
  }

  let { categoryDistribution, facet, onChanged }: Props = $props();

  // eslint-disable-next-line svelte/valid-compile
  $page.url.searchParams.forEach((value, key) => {
    if (key === facet) {
      selectedValues = JSON.parse(value);
    }
  });

  function updateSelection(event: Selected<string>[] | undefined) {
    if (event) {
      selectedValues = event.map((item) => item.value);
    }
  }

  function openChange(open: boolean) {
    if (!open) {
      tick().then(() => onChanged(facet, selectedValues));
    }
  }

</script>

<Select
  multiple
  onOpenChange={openChange}
  onSelectedChange={updateSelection}
  selected={selections}
  typeahead>
  <Trigger class="w-full">
    {selectedValues.length ? `${facet}: ${selectedValues.length}  geselecteerd` : `Selecteer ${facet}`}
  </Trigger>
  <Content>
    {#each Object.keys(categoryDistribution) as category}
      <SelectItem value={category}>
        {`${category} (${categoryDistribution[category]})`}
      </SelectItem>
    {/each}
  </Content>
</Select>
<Input name={facet} type="hidden" value={JSON.stringify(selectedValues)} />
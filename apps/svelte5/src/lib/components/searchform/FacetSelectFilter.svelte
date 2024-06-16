<script lang="ts">
  import { Content, Select, SelectItem, Trigger } from '$lib/components/ui/select/index.js';
  import { Input } from '$lib/components/ui/input/index.js';
  import type { Selected } from 'bits-ui';
  import type { CategoriesDistribution } from 'meilisearch';
  import { tick } from 'svelte';


  type Props = {
    selectedValues: string[],
    onChanged: (facet: string, selectedValues: string[]) => void,
    facet: string,
    categoryDistribution: CategoriesDistribution
  }

  let { categoryDistribution, facet, onChanged, selectedValues }: Props = $props();

  if (selectedValues === undefined) {
    selectedValues = [];
  }

  let selections = $derived.by(() => {
    return selectedValues.map(s => {
      return { 'value': s };
    });
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
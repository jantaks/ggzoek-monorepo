<script lang="ts">
  import { Content, Select, SelectItem, Trigger } from '$lib/components/ui/select/index.js';
  import { Input } from '$lib/components/ui/input/index.js';
  import type { Selected } from 'bits-ui';
  import type { CategoriesDistribution } from 'meilisearch';

  let selectedValues = $state<string[]>([]);

  type Props = {
    facet: string,
    categoryDistribution: CategoriesDistribution
  }
  let { categoryDistribution, facet }: Props = $props();

  function updateSelection(event: Selected<string>[] | undefined) {
    if (event) {
      selectedValues = event.map((item) => item.value);
    }
  }

</script>

<Select multiple onSelectedChange={updateSelection} typeahead>
  <Trigger class="w-full">
    {selectedValues.length ? `${facet}: ${selectedValues.length}  geselecteerd` : `Selecteer ${facet}`}
  </Trigger>
  <Content>
    {#each Object.keys(categoryDistribution) as category}
      <SelectItem value={category}>{`${category} (${categoryDistribution[category]})`}</SelectItem>
    {/each}
  </Content>
</Select>
<Input name={facet} type="hidden" value={JSON.stringify(selectedValues)} />
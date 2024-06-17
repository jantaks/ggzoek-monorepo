<script lang="ts">

  import { filterStore } from '$lib/components/searchform/filters.svelte';
  import { Button } from '$lib/components/ui/form';
  import type { Selected } from 'bits-ui';
  import { tick } from 'svelte';
  import CloseIcon from '$lib/components/icons/CloseIcon.svelte';

  type Props = {
    onChanged: () => void,
  }

  const { onChanged }: Props = $props();

  function removeFilter(facet: string, value: Selected<string>) {
    filterStore.remove(facet, value);
    tick().then(onChanged);
  }
</script>

{#each Object.keys(filterStore.filters) as tag}
  {#each filterStore.filters[tag] as selected}
    <Button class='p-4 flex flex-row justify-between'>
      {selected.value}
      <button onclick={() => removeFilter(tag, selected)}>
        <CloseIcon class="w-4 h-4" />
      </button>
    </Button>
  {/each}
{/each}
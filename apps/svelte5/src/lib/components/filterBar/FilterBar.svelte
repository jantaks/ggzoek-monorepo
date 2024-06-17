<script lang="ts">

  import { filterStore, formStore } from '$lib/stores/stores.svelte.js';
  import { Button } from '$lib/components/ui/form';
  import type { Selected } from 'bits-ui';
  import { tick } from 'svelte';
  import CloseIcon from '$lib/components/icons/CloseIcon.svelte';

  function removeFilter(facet: string, value: Selected<string>) {
    filterStore.remove(facet, value);
    tick().then(formStore.submit);
  }

  function removeAllFilters() {
    filterStore.removeAll();
    console.log('Remove all filters');
    tick().then(formStore.submit);
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
<Button onclick={removeAllFilters}>Verwijder alle filters</Button>
<script lang="ts">

  import { filterStore, formStore } from '$lib/stores/stores.svelte.js';
  import type { Selected } from 'bits-ui';
  import { tick } from 'svelte';
  import RemoveIcon from '$lib/components/icons/CloseIcon.svelte';
  import Bin from '$lib/components/icons/Bin.svelte';
  import { Button } from '$lib/components/ui/button';


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

<div class="bg-blue-300 flex flex-wrap gap-2 w-full p-2 justify-items-start h-fit min-h-12">
  {#each Object.keys(filterStore.filters) as tag}
    {#each filterStore.filters[tag] as selected}
      <Button class='flex flex-row justify-between h-8'>
        {selected.value}
        <RemoveIcon onclick={() => removeFilter(tag, selected)} class="size-4  ml-1" />
      </Button>
    {/each}
  {/each}
  {#if filterStore.filterCount() > 1}
    <Button class='flex flex-row justify-between h-8'>
      Verwijder alle filters
      <Bin onclick={() => removeAllFilters()} class="size-4  ml-1" />
    </Button>
  {/if}
</div>




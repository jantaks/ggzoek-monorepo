<script lang="ts">

  import { filterStore, formStore } from '$lib/stores/stores.svelte.js';
  import type { Selected } from 'bits-ui';
  import { tick } from 'svelte';
  import RemoveIcon from '$lib/components/icons/CloseIcon.svelte';
  import { Button } from '$lib/components/ui/button';
  import { type facet } from '$lib/types';


  function removeFilter(facet: facet, value: Selected<string>) {
    filterStore.remove(facet, value);
    tick().then(formStore.submit);
  }

  function toggleOperator(facet: facet) {
    filterStore.toggleOperator(facet);
    tick().then(formStore.submit);
  }
  
</script>

{#if filterStore.hasFilters()}
  <div class="flex flex-wrap gap-2 w-full justify-items-start">
    {#each filterStore.nonEmptyFilters() as facet}
      <div class="bg-gray-300 flex flex-wrap p-2 items-center rounded-lg gap-1">
        {#each filterStore.filters[facet] as selected, index}
          <Button class='flex flex-row justify-between p-1 h-6 uppercase text-xs bg-pink-500'>
            {selected.value}
            <RemoveIcon onclick={() => removeFilter(facet, selected)} class="size-4  ml-1" />
          </Button>
          {#if index !== filterStore.get(facet).length - 1}
            <Button class="h-6 p-1 bg-gray-700/50" onclick={() => toggleOperator(facet)}>
              {filterStore.getOperator(facet) === 'AND' ? 'EN' : 'OF'}
            </Button>
          {/if}
        {/each}
      </div>
    {/each}
  </div>
{/if}




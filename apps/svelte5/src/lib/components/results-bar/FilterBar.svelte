<script lang="ts">

	import RemoveIcon from '$lib/components/icons/CloseIcon.svelte';
	import { Button } from '$lib/components/ui/button';
	import RemoveFiltersButton from '$lib/components/searchform/RemoveFiltersButton.svelte';
	import type { ListboxOption } from '@melt-ui/svelte/dist/builders/listbox';
	import { Filter, getSearchForm } from '$lib/stores/formStore.svelte';

	let form = getSearchForm();


	function removeFilter(facet: string, selection: ListboxOption<string>) {
		let filter = form.getFilter(facet);
		if (filter) {
			console.log('remove filter', selection);
			filter.removeSelected(selection);
		} else {
			console.error('Filter not found', facet);
		}
		form.submit();
	}

	function toggleOperator(filter: Filter) {
		console.log('toggle operator', filter);
		filter.operator = filter.operator === 'AND' ? 'OR' : 'AND';
		form.submit();
	}


</script>

<div class="flex flex-wrap gap-2 w-full justify-items-start">

	{#each form.filters.filter(f => f.isActive) as filter}
		<div class="bg-secondary-400/60 flex flex-wrap p-2 items-center rounded-lg gap-1">
			{#each Array.from(filter.selectedValues).sort() as selected, index}
				<Button class='flex flex-row justify-between p-1 h-6 uppercase text-xs bg-primary text-white'>
					{selected}
					<RemoveIcon onclick={() => removeFilter(filter.facet, selected)} class="size-4  ml-1" />
				</Button>
				{#if index !== filter.selectedValues.size - 1}
					<Button class="h-6 p-1 bg-secondary-800 text-white" onclick={() => toggleOperator(filter)}>
						{filter.operator === 'AND' ? 'EN' : 'OF'}
					</Button>
				{/if}
			{/each}
		</div>
	{/each}
	{#if form.filters.reduce((acc, f) => acc + f.selectedValues.size, 0) > 1}
		<RemoveFiltersButton />
	{/if}
</div>



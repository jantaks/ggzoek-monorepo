<script lang="ts">
	import { ChevronDown, ChevronUp } from '$lib/components/icons/index.js';
	import type { FacetHit } from 'meilisearch';
	import type { facet } from '$lib/types';
	import { getSearchForm } from '$lib/stores/formStore.svelte';
	import { page } from '$app/stores';
	import { slide } from 'svelte/transition';
	import type { FormEventHandler } from 'svelte/elements';


	type Props = {
		facets: FacetHit[]
		filterLabel: facet,
		id: number
	}

	const form = getSearchForm();

	let { filterLabel, facets, id }: Props = $props();

	const options = facets.map((facet) => facet.value);
	let selectedOptions = $state(new Set<string>());
	let filteredOptions = $state(options);
	let inputValue = $state('');
	let open = $state(false);

	$inspect(inputValue);


	function getFacetCount(value: string) {
		const facetCount = $page.data.searchResponse.facetDistribution[filterLabel];
		return facetCount[value] || 0;

	}

	let filter = form.addFilter(filterLabel);
	const isSelected = (value: string) => {
		return filter.selectedValues.has(value);
	};

	const handleInput: FormEventHandler<HTMLInputElement> = (event) => {
		open = true;
		const value = event.currentTarget.value;
		filteredOptions = options.filter(option => option.toLowerCase().includes(value.toLowerCase()));
	};

	function resetValue() {
		inputValue = selectedOptions.size > 0 ? `${selectedOptions.size} geselecteerd` : '';
		filteredOptions = options;
	}

	function handleSelect(event: any, option: string) {
		if (event.target.checked) {
			selectedOptions.add(option);
		} else {
			selectedOptions.delete(option);
		}
		resetValue();
	}

	function toggleOpen(event: MouseEvent) {
		console.log('toggleOpen');
		open = !open;
		if (!open) {
			resetValue();
		}
	}

	function handleOutsideClick(event: MouseEvent) {
		const target = event.target as HTMLElement;
		console.log('target data: ', target.dataset.filter);
		if (!target.closest(`div[data-filter="${id}"]`)) {
			console.log('clicked outside: ', id);
			open = false;
			resetValue();
		}
	}


</script>
<svelte:body onclick={handleOutsideClick}></svelte:body>
<div class="grid-cols-1 space-y-1 filter" data-filter={id}>
	<h2 class="capitalize">{filterLabel}:</h2>
	<div class="text-secondary-900 ">
		<div class="relative">
			<div class="relative">
				<input
					bind:value={inputValue}
					class="w-full py-2 px-4"
					onfocus={() => {open = true; inputValue = ''}}
					oninput={handleInput}
					placeholder={`Selecteer ${filterLabel}`}
					type="text"
				>
				<button class="block" data-filter={id} onclick={(e) => toggleOpen(e)}>
					<ChevronDown class={`size-8 absolute right-2 top-1 ${open? "rotate-180": ""}`}></ChevronDown>
				</button>
			</div>
			{#if open}
				<ul
					class="md:absolute left-0 right-0 p-4 bg-white overflow-hidden space-y-2 border border-gray-300 rounded shadow-lg z-10 md:h-80 md:overflow-y-auto "
					transition:slide={{duration:300}}>
					{#if filteredOptions.length === 0}
						<li class="p-1">Geen {filterLabel} gevonden</li>
					{/if}
					{#each filteredOptions as option (option)}
						<li class="p-1 flex flex-row items-center space-x-4 max-w-96">
							<input
								class="custom-checkbox"
								type="checkbox"
								id={option}
								name={option}
								value={option}
								onchange={(e) => handleSelect(e, option)}
								checked={selectedOptions.has(option)}
							/>
							<label
								class="cursor-pointer"
								for={option}>{@render highlight(option, inputValue)}</label>
						</li>
					{/each}
				</ul>
			{/if}

		</div>

	</div>
</div>


{#snippet highlight(text, substring)}
	{#if text && substring}
		{@html text.replaceAll(new RegExp(substring, 'gi'), (match) => `<span class="bg-primary/50">${match}</span>`)}
	{:else}
		{text}
	{/if}
{/snippet}

<style>
    /* Hide the native checkbox */
    .custom-checkbox {
        @apply appearance-none;
        @apply min-w-6 min-h-6 border border-secondary rounded-md bg-transparent cursor-pointer relative;
        @apply hover:bg-primary/30
    }

    /* Create the checkmark */
    .custom-checkbox:checked::after {
        content: '✓';
        @apply text-white font-bold absolute top-1/2 left-1/2;
        transform: translate(-50%, -50%);
    }

    /* Background color when checked */
    .custom-checkbox:checked {
        @apply bg-primary border-primary;
    }


</style>
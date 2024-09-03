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
		filter.selectedValues = new Set(selectedOptions);
		form.submit();
	}

	function toggleOpen(event: MouseEvent) {
		open = !open;
		if (!open) {
			resetValue();
		}
	}

	function handleOutsideClick(event: MouseEvent) {
		const target = event.target as HTMLElement;
		if (!target.closest(`div[data-filter="${id}"]`)) {
			open = false;
			resetValue();
		}
	}

	let selectedIndex = -1;

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			open = false;
			inputValue = '';
		}
		if (event.key === 'ArrowDown' && filteredOptions.length > 0) {
			event.preventDefault();
			if (!open) {
				open = true;
			} else {
				selectedIndex = (selectedIndex + 1) % filteredOptions.length;
				focusOption(selectedIndex);
			}
		}
		if (event.key === 'ArrowUp' && filteredOptions.length > 0) {
			event.preventDefault();
			if (!open) {
				open = true;
			} else {
				selectedIndex = (selectedIndex - 1) % filteredOptions.length;
				focusOption(selectedIndex);
			}
		}
		if (event.key === 'Tab') {
			open = false;
			resetValue();
		}
	}

	let el: HTMLElement | null;

	function focusOption(index: number) {
		const labelElements = el?.querySelectorAll('label') || [];
		let focusElement = labelElements[index];
		if (labelElements.length > 0 && focusElement) {
			focusElement.focus();
		}
	}

	function onFocusOut(event: FocusEvent) {
		// open = false;
		// resetValue();
	}


</script>
<svelte:body onclick={handleOutsideClick}></svelte:body>
<div bind:this={el} class="grid-cols-1 space-y-1 filter">
	<h2 class="capitalize">{filterLabel}:</h2>
	<div class="text-secondary-900 ">
		<div class="relative " data-filter={id}>
			<div class="relative">
				<input
					bind:value={inputValue}
					class="w-full py-2 px-4"
					onfocus={(e) => {
            if (!open) {
              open = true;
              resetValue();
            }
          }}
					onfocusout={onFocusOut}
					oninput={handleInput}
					onkeydown={handleKeydown}
					onmousedown={toggleOpen}
					placeholder={`Selecteer ${filterLabel}`}
					type="text"
				>
				<button class="block" data-filter={id} onclick={(e) => toggleOpen(e)}>
					<ChevronDown class={`size-8 absolute right-2 top-1 ${open? "rotate-180": ""}`}></ChevronDown>
				</button>
			</div>
			{#if open}
				<div
					class="mt-1 md:absolute left-0 right-0 p-4 bg-white overflow-hidden space-y-2 border border-gray-300 rounded shadow-lg z-10 md:h-80 md:overflow-y-auto "
					transition:slide={{duration:150}}>
					{#if filteredOptions.length === 0}
						<p class="p-1">Geen {filterLabel} gevonden</p>
					{/if}
					{#each filteredOptions as option (option)}
						<label
							class="focus:bg-green-400 cursor-pointer hover:bg-secondary-100  w-full flex flex-row items-center space-x-2 p-2 rounded label-with-focus"
							for={option}
							onkeydown={handleKeydown}
						>
							<input
								class="custom-checkbox group focus:bg-green-400"
								type="checkbox"
								id={option}
								name={option}
								value={option}
								onchange={(e) => handleSelect(e, option)}
								checked={selectedOptions.has(option)}
							/>
							<span>{@render highlight(option, inputValue)}</span>
						</label>
					{/each}
				</div>
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

    /* Custom CSS to change the label background when the input is focused */
    .custom-checkbox:focus + label {
        /*@apply bg-primary text-xl;*/
    }


    /* Hide the native checkbox */
    .custom-checkbox {
        @apply appearance-none;
        @apply min-w-6 min-h-6 border border-secondary rounded-md bg-transparent cursor-pointer relative;

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

    .custom-checkbox:focus {
        /*@apply bg-green-400 border-primary;*/
    }


</style>
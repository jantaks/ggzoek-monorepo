<script lang="ts">
	import { ChevronDown, X } from 'lucide-svelte';
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
	let filteredOptions = $state(options);
	let inputValue = $state('');
	let placeHolder = $state(filterLabel);
	let open = $state(false);

	$effect(() => {
		resetPlaceholder();
	});

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

	function resetPlaceholder() {
		placeHolder = filter.selectedValues.size > 0 ? `${filterLabel} (${filter.selectedValues.size})` : filterLabel;
		filteredOptions = options;
	}

	function handleSelect(event: any, option: string) {
		open = false;
		if (event.target.checked) {
			filter.selectedValues = new Set(filter.selectedValues.add(option));
		} else {
			filter.selectedValues.delete(option);
			filter.selectedValues = new Set(filter.selectedValues);
		}
		inputValue = '';
		resetPlaceholder();
		form.submit();
	}

	function toggleOpen(event: MouseEvent) {
		if (!open) {
			open = true;
			inputElement.focus();
		} else {
			open = false;
			resetPlaceholder();
		}
		// open = !open;
		focusedElementIndex = -1;
		// if (!open) {
		// 	resetPlaceholder();
		// }
	}

	function handleOutsideClick(event: MouseEvent) {
		const target = event.target as HTMLElement;
		if (!target.closest(`div[data-filter="${id}"]`)) {
			open = false;
			resetPlaceholder();
		}
	}

	let focusedElementIndex = -1;

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			open = false;
			resetPlaceholder();
		}
		if (event.key === 'ArrowDown' && filteredOptions.length > 0) {
			event.preventDefault();
			if (!open) {
				open = true;
			} else {
				focusedElementIndex = (focusedElementIndex + 1) % filteredOptions.length;
				focusOption(focusedElementIndex);
			}
		}
		if (event.key === 'ArrowUp' && filteredOptions.length > 0) {
			event.preventDefault();
			if (!open) {
				open = true;
			} else {
				focusedElementIndex = (focusedElementIndex - 1) % filteredOptions.length;
				focusOption(focusedElementIndex);
			}
		}
		if (event.key === 'Tab') {
			open = false;
			resetPlaceholder();
		}
	}

	let el: HTMLElement | null;

	function focusOption(index: number) {
		console.log(index);
		const inputElements = el?.querySelectorAll('.custom-checkbox') || [];
		let focusElement = inputElements[index];
		console.log(focusElement);
		if (inputElements.length > 0 && focusElement) {
			focusElement.focus();
		}
	}

	function onFocusOut(event: FocusEvent) {
		// inputValue = '';
		// resetPlaceholder();
	}

	function onFocus(event: FocusEvent) {
		placeHolder = 'Type om te zoeken ...';
		if (!open) {
			open = true;
			resetPlaceholder();
		}
	}

	function clearFilter() {
		filter.selectedValues = new Set();
		form.submit();
	}

	let inputElement: HTMLInputElement;

</script>
<svelte:body onclick={handleOutsideClick}></svelte:body>
<div bind:this={el} class="grid-cols-1 space-y-1 filter">
	<div class="text-secondary-900 ">
		<div class="relative " data-filter={id}>
			<div class="relative">
				<input
					bind:this={inputElement}
					bind:value={inputValue}
					class={`rounded w-full py-2 px-4   ${placeHolder === "Type om te zoeken ..." ? 'placeholder-secondary-900/50' : 'placeholder-secondary-900 capitalize'}`}
					onfocus={onFocus}
					onfocusout={onFocusOut}
					oninput={handleInput}
					onkeydown={handleKeydown}
					onmousedown={toggleOpen}
					placeholder={placeHolder}
					type="text"
				>
				<button class="absolute inset-y-0 end-1 flex items-center ps-3" data-filter={id}
								onclick={(e) => toggleOpen(e)}>
					<ChevronDown class={`size-8 a ${open? "rotate-180": ""}`}></ChevronDown>
				</button>
				{#if filter.selectedValues.size > 0}
					<button class="block" data-filter={id} onclick={clearFilter}>
						<X class={`size-6 absolute right-11 top-2 ${open? "rotate-180": ""}`}></X>
					</button>
				{/if}

			</div>
			{#if open}
				<div
					class="mt-1 md:absolute left-0 right-0 p-4 bg-white overflow-hidden space-y-2 border border-gray-300 rounded shadow-lg z-10 md:h-80 md:overflow-y-auto "
					transition:slide={{duration:150}}>
					{#if filteredOptions.length === 0}
						<p class="p-1">Geen {filterLabel} gevonden</p>
					{/if}
					{#each filteredOptions as option (option)}
						<div class="flex flex-row items-center space-x-2">
							<input
								class="custom-checkbox peer"
								type="checkbox"
								id={option}
								name={option}
								value={option}
								onkeydown={handleKeydown}
								onchange={(e) => handleSelect(e, option)}
								checked={filter.selectedValues.has(option)}
							/>
							<label
								class="peer-focus:bg-secondary-100 cursor-pointer hover:bg-secondary-100  w-full  p-2 rounded label-with-focus"
								for={option}
							>
								<span>{@render highlight(option, inputValue)}</span>
							</label>
						</div>

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

</style>
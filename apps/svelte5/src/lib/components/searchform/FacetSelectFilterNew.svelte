<script lang="ts">
	import { type ComboboxOptionProps, createCombobox, type CreateComboboxProps, melt } from '@melt-ui/svelte';
	import { Check, ChevronDown, ChevronUp } from '$lib/components/icons/index.js';
	import { fly } from 'svelte/transition';
	import type { FacetHit } from 'meilisearch';
	import type { facet } from '$lib/types';
	import { getSearchForm } from '$lib/stores/formStore.svelte';
	import { page } from '$app/stores';


	type Props = {
		facets: FacetHit[]
		filterLabel: facet,
	}

	const form = getSearchForm();

	let { filterLabel, facets }: Props = $props();


	function getFacetCount(value: string) {
		const facetCount = $page.data.searchResponse.facetDistribution[filterLabel];
		return facetCount[value] || 0;
	}

	const options = facets.map((facet) => facet.value);

	let filter = form.addFilter(filterLabel);

	const toOption = (value: string): ComboboxOptionProps<string> => ({
		value: value,
		label: value,
		disabled: false
	});

	const onChange: CreateComboboxProps<string, true>['onSelectedChange'] = ({ curr, next }) => {
		$open = false;
		if (next) {
			filter.selectedValues = new Set(next.map((value) => (value.value)));
			form.submit();
		}

		return next;
	};

	let {
		elements: { menu, input, option, label },
		states: { open, touchedInput, inputValue }
	} = createCombobox<string, true>({
		forceVisible: true,
		multiple: true,
		onSelectedChange: onChange,
		selected: {
			update(updater) {
				updater(Array.from(filter.selectedValues).map(toOption));
			}, set() {
			},
			subscribe() {
				return () => {
				};
			}
		}
	});

	$effect(() => {
		if (!$open && filter.selectedValues.size > 0) {
			$inputValue = filter.selectedValues.size + ' geselecteerd';
		} else {
			$inputValue = '';
		}
	});

	const filteredOptions = $derived.by(() => {
		return $touchedInput
			? options.filter((option) => {
				const normalizedInput = $inputValue ? $inputValue.toLowerCase() : '';
				return (
					option.toLowerCase().includes(normalizedInput)
				);
			})
			: options;
	});

	const isSelected = (value: string) => {
		return filter.selectedValues.has(value);
	};

</script>

<div class="flex flex-col gap-1 ">
	<!-- svelte-ignore a11y_label_has_associated_control - $label contains the 'for' attribute -->
	<label use:melt={$label}>
    <span class=" font-medium text-primary-light capitalize"
		>{filterLabel}:</span
		>
	</label>

	<div class="relative w-full">
		<input
			class="flex h-10  items-center justify-between rounded-lg bg-white border border-primary-light
          px-3 pr-12 text-slate-800 w-full"
			placeholder="Type om te zoeken"
			use:melt={$input}
		/>
		<div class="absolute right-1 top-1/2 z-10 -translate-y-1/2 text-primary-dark">
			{#if $open}
				<ChevronUp class="size-4" />
			{:else}
				<ChevronDown class="size-4" />
			{/if}
		</div>
	</div>
</div>
{#if $open}
	<ul
		class=" z-10 flex max-h-[500px] flex-col overflow-hidden rounded-lg"
		use:melt={$menu}
		transition:fly={{ duration: 150, y: -5 }}
	>
		<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
		<div
			class="flex max-h-full flex-col gap-0 overflow-y-auto bg-slate-50 border-2 border-slate-50 shadow px-2 py-2 text-slate-800  font-light"
			tabindex="0"
		>
			{#each filteredOptions as optionValue, index (index)}
				<li
					use:melt={$option(toOption(optionValue))}
					class="relative cursor-pointer scroll-my-2 rounded-md py-2 pl-4 pr-4
        hover:bg-primary-light
        data-[highlighted]:bg-primary-light data-[highlighted]:text-primary-dark
          data-[disabled]:opacity-50"
				>
					{#if isSelected(optionValue)}
						<div class="check absolute left-1 top-1/2 z-10 text-primary-dark">
							<Check class="size-4" />
						</div>
					{/if}
					<div class="pl-4">
						<span class="font-medium">{optionValue}</span>
						<span class=" opacity-75">{getFacetCount(optionValue)}</span>
					</div>
				</li>
			{:else}
				<li class="relative cursor-pointer rounded-md py-1 pl-8 pr-4">
					No results found
				</li>
			{/each}
		</div>
	</ul>
{/if}

<style lang="postcss">
    .check {
        @apply absolute left-2 top-1/2 text-primary;
        translate: 0 calc(-50% + 1px);
    }
</style>
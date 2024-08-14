<script lang="ts">
	import { type ComboboxOptionProps, createCombobox, melt } from '@melt-ui/svelte';
	import { fly } from 'svelte/transition';
	import { Label, Slider } from 'bits-ui';
	import { page } from '$app/stores';
	import { CloseIcon } from '$lib/components/icons';
	import DistanceSlider from '$lib/components/searchform/DistanceSlider.svelte';
	import { getSearchForm } from '$lib/stores/formStore.svelte';

	const form = getSearchForm();

	const x = { Slider, Label };

	type Plaats = {
		PC4: string,
		Plaats?: string,
		Provincie?: string,
	}

	let {
		elements: { menu, input, option, label },
		states: { open, touchedInput, inputValue }
	} = createCombobox<Plaats>({
		forceVisible: true,
		onSelectedChange: ({ curr, next }) => {
			$open = false;
			if (next) {
				plaats = next.value;
				form.postcode = plaats.PC4;
				form.submit();
			}
			return next;
		}
	});

	let plaats: Plaats | undefined = $state();
	let postcode = $page.url.searchParams.get('postcode');
	if (postcode) {
		plaats = { PC4: postcode };
		$inputValue = postcode;
	}

	$effect(() => {
		if (!plaats) return;
		$inputValue = $open ? plaats.PC4 : `${plaats.PC4} ${(plaats.Plaats ? `(${plaats.Plaats})` : '')}`;
	});

	const filteredResults = $derived.by(async () => {
		let data: Plaats[] = [];
		if ($touchedInput && $inputValue.length > 2) {
			const response = await fetch(`/postcodes?postcode=${$inputValue}`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json'
				}
			});
			if (response.ok) {
				data = await response.json();
			}
		}
		return data;
	});

	const toOption = (plaats: Plaats): ComboboxOptionProps<Plaats> => ({
		value: plaats,
		label: plaats.Plaats,
		disabled: false
	});

	const clear = () => {
		plaats = undefined;
		form.postcode = '';
		$inputValue = '';
		form.submit();
	};

	const onInput = (e: any) => {
		if (e.target.value === '') {
			plaats = undefined;
			form.postcode = '';
		}
	};

	const onBlur = (e: any) => {
		if (e.target.value == '' && plaats === undefined) {
			$inputValue = '';
			form.submit();
		}
	};
</script>

<div class="flex flex-col gap-1 w-full ">
	<!-- svelte-ignore a11y_label_has_associated_control - $label contains the 'for' attribute -->
	<label use:melt={$label}>
    <span class="text-white"
		>Postcode:</span
		>
	</label>

	<div class="relative w-full">
		<input
			class="flex h-10 items-center justify-between rounded-lg bg-white border border-primary-light
          px-3 pr-12 text-black w-full"
			onblur={onBlur}
			oninput={onInput}
			placeholder="Type om te zoeken"
			use:melt={$input}
		/>
		<div class="absolute right-1 top-1/2 z-10 -translate-y-1/2 text-primary-dark">
			{#if plaats}
				<button onclick={clear}>
					<CloseIcon />
				</button>
			{/if}
		</div>
	</div>
</div>
{#if $open}
	<ul
		class=" z-10 flex max-h-[300px] flex-col overflow-hidden rounded-lg"
		use:melt={$menu}
		transition:fly={{ duration: 150, y: -5 }}
	>
		<!-- svelte-ignore a11y_no_noninteractive_tabindex -->

		{#await filteredResults}
			<p>Searching ...</p>
		{:then filteredResults}
			{#if filteredResults && filteredResults.length > 0}
				<div
					class="flex max-h-full flex-col gap-0 overflow-y-auto bg-white px-2 py-2 text-black"
					tabindex="0"
				>
					{#each filteredResults as plaats, index (index)}
						<li
							use:melt={$option(toOption(plaats))}
							class="relative cursor-pointer scroll-my-2 rounded-md py-2 pl-4 pr-4
        hover:bg-primary-light
        data-[highlighted]:bg-primary-light data-[highlighted]:text-primary-dark
          data-[disabled]:opacity-50"
						>
							<div class="pl-4">
								<span class="font-medium">{plaats.PC4}</span>
								<span class="text-sm opacity-75">({plaats.Plaats})</span>
							</div>
						</li>
					{/each}
				</div>
			{:else if filteredResults && filteredResults.length === 0}
				<div
					class="flex max-h-full flex-col gap-0 overflow-y-auto bg-white px-2 py-2 text-black"
					tabindex="0"
				>
					<li class="text-sm text-gray-500">Geen resultaten gevonden</li>
				</div>
			{/if}
		{/await}

	</ul>
{/if}
<DistanceSlider disabled={plaats === undefined} />
<script lang="ts">
	import type { getFacets } from '$lib/search';
	import { Label, Slider } from 'bits-ui';
	import PostCodeSelect from '$lib/components/searchform/PostCodeSelect.svelte';
	import SearchBox from '$lib/components/searchform/SearchBox.svelte';
	import { ChevronDown, ChevronUp } from 'lucide-svelte';
	import { page } from '$app/stores';
	import { slide } from 'svelte/transition';
	import { browser } from '$app/environment';
	import FilterContainer from '$lib/components/searchform/FilterContainer.svelte';
	import Modal from '$lib/components/ui/modal/Modal.svelte';
	import { getSearchForm } from '$lib/stores/formStore.svelte';

	const x = { Slider, Label };

	const form = getSearchForm();


	$effect(() => {
		$page.data;
	});


	type Props = {
		facets: Awaited<ReturnType<typeof getFacets>>,
	}

	let { facets }: Props = $props();

	let innerWidth: number = $state(0);


</script>

<svelte:window bind:innerWidth />


{#if innerWidth < 768 && browser}
	{@render collapsedForm()}
{:else}
	{@render fullForm()}
{/if}

{#snippet fullForm()}
	<div
		class="p-4 md:p-4 bg-gradient-to-r from-primary to-primary/90 md:rounded-xl shadow-xl text-primary-light space-y-6">
		<div class="">
			<SearchBox />
		</div>
		<div class="space-y-4 text-primary-200">
			<PostCodeSelect />
		</div>
		<div class="space-y-4">
			<FilterContainer facets={facets}></FilterContainer>
		</div>
	</div>
{/snippet}

{#snippet collapsedForm()}
	<div
		class="p-2 md:p-4 justify-left bg-primary md:rounded-xl shadow-xl text-primary-light">
		<div class="">
			<SearchBox />
		</div>
	</div>
	<div class="flex flex-row mx-auto rounded-b-lg bg-secondary-900 w-fit px-4 py-1">
		<a href={`/zoekresultaten/formonly?${$page.url.searchParams}`}
			 class="w-full flex flex-row  justify-center items-center text-primary-200 font-light ~text-xs/lg">
			Toon filters ({form.filteredValueCount})
			<ChevronDown
				class="ml-2 size-6 text-primary-200 transform hover:scale-125 transition duration-500 ease-in-out" />
		</a>
	</div>
{/snippet}


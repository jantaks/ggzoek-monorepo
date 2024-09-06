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

	const x = { Slider, Label };

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
	<div class="px-2 py-4 md:p-4 bg-primary md:rounded-xl shadow-xl text-primary-light space-y-6">
		<div class="">
			<SearchBox />
		</div>
		<div class="space-y-4 text-white">
			<PostCodeSelect />
		</div>
		<div class="space-y-4">
			<FilterContainer facets={facets}></FilterContainer>
		</div>
	</div>
{/snippet}

{#snippet collapsedForm()}
	<div
		class="px-2 py-4 5255252 md:p-4 justify-left bg-primary md:rounded-xl shadow-xl text-primary-light">
		<div class="">
			<SearchBox />
		</div>
	</div>
	<div class="flex flex-row mx-auto rounded-b-xl bg-primary w-fit px-2 text-white font-bold">
		<a href={`/zoekresultaten/formonly?${$page.url.searchParams}`}
			 class="w-full flex flex-row text-primary-light justify-center items-center text-sm">
			Uitgebreid zoeken
			<ChevronDown
				class="size-8 text-white transform hover:scale-125 transition duration-500 ease-in-out" />
		</a>
	</div>
{/snippet}


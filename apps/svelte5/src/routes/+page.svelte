<script lang="ts">
	import type { PageData } from './$types';
	import SearchBox from '$lib/components/searchform/SearchBox.svelte';
	import FilterContainer from '$lib/components/searchform/FilterContainer.svelte';
	import PostCodeSelect from '$lib/components/searchform/PostCodeSelect.svelte';
	import ResultButton from '$lib/components/searchform/ResultButton.svelte';
	import { getSearchForm } from '$lib/stores/formStore.svelte';
	import { slide } from 'svelte/transition';

	let { data } = $props();
	let form = getSearchForm();
	import { page } from '$app/stores';
	import { browser } from '$app/environment';

</script>

<svelte:head>
	<style>
      body {
          @apply bg-secondary-900;
      }
	</style>
</svelte:head>

<div class="w-full bg-secondary-900 flex flex-col flex-grow items-center">
	<div
		class="mx-auto max-w-7xl pb-4 text-primary-200 md:pb-0 flex-grow flex flex-col">
		<h1 class="py-20 text-6xl font-bold tracking-tight text-primary-200">Alle vacatures in de GGZ <span
			class=" text-primary">voor zorgprofessionals</span></h1>

		<div class="lg:grid lg:grid-cols-2">
			<div class="flex flex-col gap-4 pb-8 xl:gap-8">

				<p class="lg:text-2xl text-lg text-primary-200">
					Voor professionals in de ggz is het moeilijk om een overzicht te krijgen van alle
					vacatures. Daarom hebben wij GGZoek gemaakt, een centrale, eenvoudige plek om vacatures
					te vinden en met elkaar te vergelijken.
				</p>
			</div>
			<div
				class=" w-full sm:max-w-2xl sm:text-center lg:flex lg:items-center lg:text-left"
			>
				<!--				<SearchBox actionUrl='/zoekresultaten'></SearchBox>-->
				{#if browser}
					<div
						class="glowing slide-in p-4 md:p-4 bg-gradient-to-r from-primary to-primary/90 md:rounded-xl shadow-2xl shadow-primary-400/70 text-primary-light space-y-4 w-full"
					>

						<SearchBox />
						<PostCodeSelect />
						<FilterContainer facets={data.facets}></FilterContainer>
						<ResultButton
							href={`/zoekresultaten?${$page.url.searchParams}`}
							isLoading={form.isLoading}
							totalHits={data.searchResponse.estimatedTotalHits} />
					</div>
				{/if}
			</div>
		</div>
	</div>
</div>

<div
	class="relative mx-auto flex flex-col items-center justify-center gap-32 bg-yellow-300 px-4 py-0 sm:px-6 lg:px-8"
>
	<svg
		class="absolute top-0 text-secondary-900"
		fill="currentColor"
		viewBox="0 0 1440 58"
		width="100%"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path
			d="M-100 58C-100 58 218.416 36.3297 693.5 36.3297C1168.58 36.3297 1487 58 1487 58V-3.8147e-06H-100V58Z"
			fill="currentColor"
		></path>
	</svg>
</div>

<style>
    .slide-in {
        animation: slide-in 2s ease-out forwards;
        /*animation-delay: 2s;*/
    }

    @keyframes slide-in {
        0% {
            opacity: 0;
            transform: translateX(100%);
        }
        50% {
            opacity: 1;
            transform: translateX(0);
            box-shadow: 0 0 0 #fef9f0, inset 0 0 0, 0 0 0 #1f2023;
        }
        75% {
            box-shadow: 0 0 30px #d7b93b, inset 0 0 0, 0 0 0 #ea8bfc;
        }
        100% {
            box-shadow: 0 0 0 #fef9f0, inset 0 0 0, 0 0 0 #1f2023;
        }
    }


</style>

<script lang="ts">
	import type { PageData } from './$types';
	import SearchBox from '$lib/components/searchform/SearchBox.svelte';
	import FilterContainer from '$lib/components/searchform/FilterContainer.svelte';
	import PostCodeSelect from '$lib/components/searchform/PostCodeSelect.svelte';

	export let data: PageData;
</script>

<svelte:head>
	<style>
      body {
          @apply bg-grijs;
      }
	</style>
</svelte:head>

<div class="w-full bg-secondary-900">
	<div class="mx-auto max-w-7xl pb-4 text-white md:pb-0 lg:px-8">
		<div class="lg:grid lg:grid-cols-2 lg:gap-8">
			<div
				class="mx-auto max-w-md px-6 sm:max-w-2xl sm:text-center lg:flex lg:items-center lg:px-0 lg:text-left"
			>
				<div class="flex flex-col gap-4 pb-8 xl:gap-8">
					<h1 class="text-3xl font-bold tracking-tight text-white sm:mt-5 md:text-4xl xl:text-5xl">
						<span class="block">Alle vacatures in de GGZ</span><span
						class="block pb-3 text-primary sm:pb-5">voor BIG professionals</span
					>
					</h1>
					<p class="lg:text-md text-lg text-gray-300">
						Voor professionals in de ggz is het vaak lastig om een overzicht te krijgen van alle
						vacatures. Daarom hebben wij GGZoek gemaakt, een centrale, eenvoudige plek om vacatures
						te vinden en met elkaar te vergelijken.
					</p>
				</div>
			</div>
			<div
				class="relative  w-full px-6 sm:max-w-2xl sm:text-center lg:flex lg:items-center lg:text-left"
			>
				<!--				<SearchBox actionUrl='/zoekresultaten'></SearchBox>-->
				<div
					class="absolute top-5 left-0 z-50 p-4 md:p-4 bg-gradient-to-r from-primary to-primary/90 md:rounded-xl shadow-2xl shadow-primary-400/70 text-primary-light space-y-6 w-full">
					<div class="">
						<SearchBox />
					</div>
					<div class="space-y-4 text-white">
						<PostCodeSelect />
					</div>
					<div class="space-y-4">
						<FilterContainer facets={data.facets}></FilterContainer>
					</div>
				</div>
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

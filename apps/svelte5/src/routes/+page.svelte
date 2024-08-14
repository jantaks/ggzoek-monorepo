<script lang="ts">
	import type { PageData } from './$types';
	import RiveComponent from '$lib/components/rive/RiveComponent.svelte';
	import NavBar from '$lib/components/navbar/NavBar.svelte';


	export let data: PageData;


</script>

<svelte:head>
	<style>
      body {
          @apply bg-gradient-to-r from-secondary-300 via-primary-light to-white;
      }
	</style>
</svelte:head>

<div class="w-full bg-secondary-900 ">
	<NavBar class="mb-4 bg-transparent text-white" showLogin></NavBar>
	<div class="mx-auto max-w-7xl pb-4 md:pb-0 lg:px-8 text-white">
		<div class="lg:grid lg:grid-cols-2 lg:gap-8">
			<div
				class="mx-auto max-w-md px-6 sm:max-w-2xl sm:text-center lg:flex lg:items-center lg:px-0 lg:text-left ">
				<div class="flex flex-col pb-8 gap-5">
					<h1
						class="mt-4 text-3xl font-bold tracking-tight text-white sm:mt-5 sm:text-6xl lg:mt-6 xl:text-5xl">
					<span
						class="block">Alle vacatures in de GGZ</span><span
						class="block pb-3 text-primary sm:pb-5">voor BIG professionals</span>
					</h1>
					<p class="lg:text-md text-lg text-gray-300">Voor professionals in de ggz is het moeilijk om een overzicht te
						krijgen van alle vacatures. Daarom hebben wij GGZoek gemaakt, een centrale, eenvoudige plek om vacatures te
						vinden en met elkaar te vergelijken.
					</p>
					<div
						class="relative mt-4 flex w-full flex-col items-stretch justify-stretch gap-2 sm:justify-center md:flex-row lg:justify-start">
						<a
							class="line-clamp-1 flex items-center justify-center gap-2 rounded-md bg-primary px-6 py-3 text-center text-base font-bold text-white shadow-sm hover:bg-primary/80"
							href="/zoekresultaten">Zoek in 2023 vacatures</a>
					</div>
				</div>
			</div>
			<div
				class="mx-auto max-w-md px-6 sm:max-w-2xl sm:text-center lg:flex lg:items-center lg:px-0 lg:text-left  hidden">
				<div class="absolute right-40 top-10 bg-transparent z-10">
					<RiveComponent src="/ggzoek3.riv" stateMachines="StateMachine1" />
				</div>
			</div>
		</div>
	</div>
</div>
<div class="bg-yellow-300 relative mx-auto flex flex-col items-center justify-center gap-32  py-0 px-4 sm:px-6 lg:px-8">
	<svg class="absolute top-0  text-secondary-900" fill="currentColor" viewBox="0 0 1440 58" width="100%"
			 xmlns="http://www.w3.org/2000/svg">
		<path d="M-100 58C-100 58 218.416 36.3297 693.5 36.3297C1168.58 36.3297 1487 58 1487 58V-3.8147e-06H-100V58Z"
					fill="currentColor"></path>
	</svg>
</div>


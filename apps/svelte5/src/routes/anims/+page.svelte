<script lang="ts">
	import SearchBox from '$lib/components/searchform/SearchBox.svelte';
	import FilterContainer from '$lib/components/searchform/FilterContainer.svelte';
	import PostCodeSelect from '$lib/components/searchform/PostCodeSelect.svelte';
	import ResultButton from '$lib/components/searchform/ResultButton.svelte';
	import { getSearchForm } from '$lib/stores/formStore.svelte';
	import { page } from '$app/stores';
	import { browser } from '$app/environment';
	import { gsap } from 'gsap';
	import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

	let { data } = $props();
	let form = getSearchForm();


	$effect(() => {
		gsap.registerPlugin(ScrollTrigger);

		const tl = gsap.timeline()
			.from('#box-1', { x: '100%', duration: 1 }, 'start');

		tl.tweenFromTo(0, 1);

		// ScrollTrigger.create({
		// 	trigger: '#text-1',
		// 	start: 'top 10%%',
		// 	animation: tl.resume(),
		// 	onEnter: () => tl.reverse()
		// });

		gsap.from('#box-2',
			{
				scrollTrigger: {
					trigger: '#box-2',
					start: 'top 80%',
					end: 'top 20%',
					toggleActions: 'restart reverse restart reverse',
					scrub: 1
					// pinSpacer: false,
					// pin: true
				},
				height: 0,
				width: 0,
				opacity: 0,
				duration: 1,
				onUpdate: () => {
					ScrollTrigger.refresh();
				}
			});

		gsap.from('#storage-number', {
			scrollTrigger: {
				trigger: '#box-3',
				start: 'top 50%',
				end: 'top 20%',
				toggleActions: 'restart reverse restart reverse',
				markers: true,
				scrub: 2

			},
			innerText: 0,
			duration: 3,
			ease: 'steps(30)',
			snap: {
				innerText: 1
			}
		});


	});


</script>

<svelte:head>
	<style>
      body {
          @apply bg-secondary-900;
          @apply text-primary-200;
      }
	</style>
</svelte:head>
<section id="section-1">
	<h1 class="py-10 text-6xl font-bold tracking-tight text-primary-200 text-center">Alle vacatures in de GGZ
		<span
			class=" text-primary">voor zorgprofessionals.</span></h1>
	<div class="flex flex-row space-x-12 py-8 ">
		<div class="flex flex-col w-full max-w-xl gap-8" id="text-1">
			<h2 class="text-3xl/10">Je hebt geen tijd om alle vacatures in de gaten te houden. Daarom doen wij het voor
				je.</h2>
			<p class="text-xl/8 text-primary-200 font-serif text-justify">
				Voor professionals in de ggz is het moeilijk om een overzicht te krijgen van alle
				vacatures. Daarom maken wij dagelijks een samenvatting van de vacatures van alle GGZ instellingen. We zoeken
				naar de details die belangrijk zijn voor GGZ professionals en zetten deze voor jou op een rijtje. Wij zijn
				gg<span class="">zoek</span>: het startpunt van jouw zoektocht naar een nieuwe baan in de GGZ.
			</p>
		</div>
		{#if browser}
			<div
				class="h-fit glowing slide-in p-4 md:p-4 bg-gradient-to-r from-primary to-primary/90 md:rounded-xl shadow-2xl shadow-primary-400/70 text-primary-light space-y-4 w-full"
				id="box-1"
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
</section>

<div class="bg-primary-400">
	<section class="w-full flex flex-row justify-between items-center" id="section-3">
		<div class="flex flex-col w-full max-w-xl gap-4" id="text-1">
			<h2 class="text-3xl/10">Voor alle GGZ professionals.</h2>
			<p class="text-xl/8 text-primary-200 font-serif text-justify">
				Voor professionals in de ggz is het moeilijk om een overzicht te krijgen van alle
				vacatures. Daarom maken wij dagelijks een samenvatting van de vacatures van alle GGZ instellingen. We zoeken
				naar de details die belangrijk zijn voor GGZ professionals en zetten deze voor jou op een rijtje. Wij zijn
				gg<span class="">zoek</span>: het startpunt van jouw zoektocht naar een nieuwe baan in de GGZ.
			</p>
		</div>
		<div class="w-[600px] h-[800px] bg-blue-500 flex flex-col items-center justify-center text-9xl"
				 id="box-3">
			<p id="storage-number">347</p>
		</div>
	</section>
</div>
<div class="bg-secondary-900	 h-full">
	<section class="text-white w-full flex flex-row justify-between items-center" id="section-2">
		<div class="flex flex-col w-full max-w-xl gap-4" id="text-1">
			<h2 class="text-3xl/10">Voor alle GGZ professionals.</h2>
			<p class="text-xl/8 text-primary-200 font-serif text-justify">
				Voor professionals in de ggz is het moeilijk om een overzicht te krijgen van alle
				vacatures. Daarom maken wij dagelijks een samenvatting van de vacatures van alle GGZ instellingen. We zoeken
				naar de details die belangrijk zijn voor GGZ professionals en zetten deze voor jou op een rijtje. Wij zijn
				gg<span class="">zoek</span>: het startpunt van jouw zoektocht naar een nieuwe baan in de GGZ.
			</p>
		</div>
		<div class=" w-[600px] h-[800px] bg-pink-400" id="box-2"></div>
	</section>
</div>


<style>

    section {
        @apply max-w-7xl mx-auto w-full
    }

    :global(.glowing) {
        @apply rounded-xl;
        animation: glow 2s ease-out forwards;
    }

    @keyframes glow {

        0% {
            box-shadow: 0 0 0 #fef9f0, inset 0 0 0, 0 0 0 #1f2023;
        }
        50% {
            box-shadow: 0 0 30px #d7b93b, inset 0 0 0, 0 0 0 #ea8bfc;
        }
        100% {
            box-shadow: 0 0 0 #fef9f0, inset 0 0 0, 0 0 0 #1f2023;
        }
    }


</style>

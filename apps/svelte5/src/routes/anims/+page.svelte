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

	let kpis = $derived.by(() => {
		return data.facets.beroepen.map((beroep) => {
			return { title: beroep.value, number: beroep.count };
		});
	});

	$inspect(kpis);

	$effect(() => {


		gsap.registerPlugin(ScrollTrigger);

		gsap.timeline()
			.from('#box-1', { x: '100%', duration: 1 }, 'start');


		let tl = gsap.timeline();

		tl
			.to('#section-1', {
				opacity: 0,
				duration: 0.5
			})
			.to('#box-3', {
				opacity: '1',
				backgroundColor: '#3E4665',
				stagger: { amount: 2, from: 'random' },
				duration: 0.5,
				fontSize: '100%'
			})
			.from('#storage-number', {
				innerText: 0,
				stagger: { amount: 1, from: 'random' },
				opacity: 0.5,
				duration: 2,
				ease: 'steps(25)',
				snap: {
					innerText: 1
				}
			}, '<')
			.to('#storage-number', {
				fontSize: '+=7',
				color: '#D1B87D',
				repeat: 1,
				duration: 0.7,
				yoyo: true
			})
			.to('#box-3', {
				boxShadow: '5px 5px 10px #D1B87D',
				duration: 0.7,
				repeat: 1,
				yoyo: true
			}, '<');


		ScrollTrigger.create({
			trigger: '#section-3',
			start: 'top 30%',
			end: 'top top',
			toggleActions: 'restart none reset reset',
			animation: tl,
			pin: true,
			pinSpacer: true,
			markers: true
		});


	});


</script>

<svelte:head>
	<style>
      body {
          @apply bg-primary-200;
          @apply text-primary-200;
      }
	</style>
</svelte:head>
<div class="bg-secondary-900" id="section-1">
	<section class="h-fit min-h-[60vh] bg-secondary-900">
		<h1 class="py-10 text-6xl font-bold tracking-tight text-primary-200 text-center">Alle vacatures in de GGZ
			<span
				class=" text-primary">voor zorgprofessionals.</span></h1>
		<div class="grid grid-cols-2 gap-10 py-8 ">
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
</div>


{#snippet kpi(title, number)}

	<a href={"/zoekresultaten?filters=" + encodeURIComponent(`(beroepen = "${title}")`)}>

		<div id="box-3"
				 class="rounded min-w-xl p-2 h-[100px] bg-transparent opacity-100 border-secondary border"
		>
			<div class="flex flex-col items-center justify-center space-y-1"><p class="text-center">{title}</p>
				<p class="text-3xl" id="storage-number">{number}</p></div>
		</div>
	</a>

{/snippet}

<div class="bg-primary-200">
	<section class="min-h-screen" id="section-3">
		<div class="w-full grid grid-cols-2 gap-10 ">
			<div class="grid grid-cols-3 gap-2 items-center ">
				{#each kpis as { title, number }}
					{@render kpi(title, number)}
				{/each}
			</div>
			<div class="flex flex-col w-full max-w-xl gap-8 text-secondary-900" id="text-1">
				<h2 class="text-3xl/10">Iedereen op de juiste plek. Dat is onze missie. </h2>
				<p class="text-xl/8  font-serif text-justify">
					De GGZ kampt met een groot capaciteitsprobleem. Veel professionals ervaren een (te) hoge werkdruk. Dit gaat
					ten
					koste van
					werkplezier, kwaliteit van zorg en de gezondheid van de professional. Uiteindelijk komt dit ook de
					productiviteit niet ten goede. Door er voor te zorgen
					dat zoveel mogelijk professionals op de juiste plek terecht komen, draagt ggzoek een steentje bij aan het
					oplossen van dit probleem.
				</p>
			</div>
		</div>


	</section>
</div>
<div class="bg-secondary-900	 h-full">
	<section class="text-white w-full flex flex-row justify-between " id="section-2">
		<div class="flex flex-col w-full max-w-xl gap-4" id="text-1">
			<h2 class="text-3xl/10">Toch niet gevonden wat je zoekt?</h2>
			<p class="text-xl/8 text-primary-200 font-serif text-justify" id="uitdagingen">
				GGZoek gaat graag met je in gesprek over jouw wensen en uitdagingen.
			</p>
		</div>
		<div class="h-full w-full flex flex-col items-center justify-center" id="box-2">
			<img alt="Jan Taks" id="img-1" src="/boef.png" />
		</div>
	</section>
</div>


<style>

    section {
        @apply max-w-7xl mx-auto w-full py-10;
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

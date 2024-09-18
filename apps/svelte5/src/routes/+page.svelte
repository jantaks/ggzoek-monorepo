<!--https://gsap.com/community/forums/topic/37467-the-issue-when-combining-scrolltrigger-and-scrollto-plugin/-->

<script lang="ts">
	import SearchBox from '$lib/components/searchform/SearchBox.svelte';
	import FilterContainer from '$lib/components/searchform/FilterContainer.svelte';
	import PostCodeSelect from '$lib/components/searchform/PostCodeSelect.svelte';
	import ResultButton from '$lib/components/searchform/ResultButton.svelte';
	import { getSearchForm } from '$lib/stores/formStore.svelte.js';
	import { page } from '$app/stores';
	import { browser } from '$app/environment';
	import { gsap } from 'gsap';
	import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
	import { ScrollToPlugin } from 'gsap/dist/ScrollToPlugin';
	import { ArrowLeft } from 'lucide-svelte';

	let { data } = $props();


	let form = getSearchForm();

	let kpis = $derived.by(() => {
		return data.facets.beroepen.map((beroep) => {
			return { title: beroep.value, number: beroep.count };
		});
	});

	$inspect(kpis);

	$effect(() => {


			gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

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
				}, '<')
				.from('#zoek-nu', {
					opacity: 0,
					x: '20%',
					duration: 1.5,
					ease: 'elastic'
					// rotate: 10
				}, '<');


			ScrollTrigger.create({
				trigger: '#section-2',
				start: 'top 30%',
				end: 'top top',
				toggleActions: 'restart none reset reset',
				animation: tl,
				pin: true,
				pinSpacer: true
				// markers: true
			});

			let tl2 = gsap.timeline();
			tl2
				.to('#img-2', {
					repeat: 1,
					yoyo: true,
					scale: 1.2,
					duration: 1.5,
					rotate: 360
				});

			ScrollTrigger.create({
				trigger: '#section-3',
				onEnter: () => {
					gsap.to(window, {
						scrollTo: '#img-5',
						duration: 1
					});
				},
				toggleActions: 'restart none none none',
				start: 'top bottom',
				// end: 'top top',
				animation: tl2,
				markers: true
			});


			return () => {
				ScrollTrigger.getAll().forEach(st => st.kill());
				gsap.killTweensOf(window);
			};
		}
	);


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
				 class="rounded min-w-xl p-2 h-[100px] bg-transparent opacity-100 border-primary border"
		>
			<div class="flex flex-col items-center justify-center space-y-1"><p class="text-center">{title}</p>
				<p class="text-3xl" id="storage-number">{number}</p></div>
		</div>
	</a>

{/snippet}

<div class="bg-primary-200">
	<section class="min-h-screen" id="section-2">
		<div class="w-full grid grid-cols-2 gap-10 ">
			<div class="grid grid-cols-3 gap-2 items-center relative">
				{#each kpis as { title, number }}
					{@render kpi(title, number)}
				{/each}

			</div>

			<div class="flex flex-col w-full max-w-xl gap-8 text-secondary-900 " id="text-1">
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
				<div
					class="h-full items-center text-black flex flex-row font-mono text-3xl space-x-2"
					id="zoek-nu">
					<ArrowLeft class="w-12"></ArrowLeft>
					<p class="underline-offset-8 decoration-wavy font-thin">Klik een beroep om te ggzoeken</p>
				</div>
			</div>
		</div>


	</section>
</div>
<div class="bg-secondary-900 h-full min-h-screen" id="section-3">
	<section class="grid grid-cols-2  text-white w-full justify-between ">
		<div class="w-full max-w-xl gap-4">
			<h2 class="text-3xl/10">Vind je niet wat je zoekt? Wij helpen je graag, datagedreven en mensgericht. </h2>
			<p class="text-xl/8 text-primary-200 font-serif text-justify" id="uitdagingen">
				GGZoek gaat graag met je in gesprek over jouw wensen en uitdagingen.
			</p>
		</div>
		<div class="flex flex-col items-center min-h-[50vh]" id="img-5">
			hallo daar
			<!--			<img alt="Jan Taks" class="" src="/karin.png" />-->
			<!--			<img alt="Jan Taks" class="" src="/boef.png" />-->
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

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

	// let kpis = [
	// 	{ title: 'Verpleegkundigen', number: 347 },
	// 	{ title: 'Psychiaters', number: 900 },
	// 	{ title: 'GZ-psychologen', number: 1200 },
	// 	{ title: 'Orthopedagogen', number: 500 },
	// 	{ title: 'Sociaal psychiatrisch verpleegkundigen', number: 200 },
	// 	{ title: 'Klinisch psychologen', number: 100 }
	// ];

	// $inspect(data.facets.beroepen);

	let kpis = $derived.by(() => {
		return data.facets.beroepen.map((beroep) => {
			return { title: beroep.value, number: beroep.count };
		});
	});

	$inspect(kpis);

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


		let tl2 = gsap.timeline();

		tl2
			.to('#section-1', {
				opacity: 0
			})
			.to('#box-3', {
				opacity: '1',
				backgroundColor: '#3E4665',
				stagger: { amount: 1, from: 'random' },
				duration: 0.2,
				fontSize: '100%'
			}, '<')
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
			toggleActions: 'restart none reverse reverse',
			animation: tl2,
			// scrub: 2,
			pin: true,
			pinSpacer: true,
			markers: true
			// toggleClass: { targets: '#box-3', className: 'hidden' }

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
<section class="h-fit min-h-[60vh]" id="section-1">
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
					De GGZ kampt met een groot capaciteitsprobleem. Veel professionals kampen met een hoge werkdruk. Dit gaat ten
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
	<section class="text-white w-full flex flex-row justify-between items-center" id="section-2">
		<div class="flex flex-col w-full max-w-xl gap-4" id="text-1">
			<h2 class="text-3xl/10">Toch niet gevonden wat je zoekt?</h2>
			<p class="text-xl/8 text-primary-200 font-serif text-justify">
				GGZoek gaat graag met je in gesprek over jouw wensen en uitdagingen.
			</p>
		</div>
		<div class=" w-[600px] h-[800px] bg-pink-400" id="box-2"></div>
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

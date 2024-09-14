<script lang="ts">
	import SearchBox from '$lib/components/searchform/SearchBox.svelte';
	import FilterContainer from '$lib/components/searchform/FilterContainer.svelte';
	import PostCodeSelect from '$lib/components/searchform/PostCodeSelect.svelte';
	import ResultButton from '$lib/components/searchform/ResultButton.svelte';
	import { getSearchForm } from '$lib/stores/formStore.svelte';
	import { page } from '$app/stores';
	import { browser } from '$app/environment';
	import { tick } from 'svelte';
	import { gsap } from 'gsap';
	import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

	let { data } = $props();
	let form = getSearchForm();

	let section_1: HTMLElement;
	let section_2: HTMLElement;
	let section_3: HTMLElement;


	let scrollY = $state(0);
	let ignoreScroll = $state(true);

	function handleScroll(e: Event) {
		if (!ignoreScroll) {
			ignoreScroll = true;
			section_2.scrollIntoView({ behavior: 'smooth', block: 'center' });
			setTimeout(() => {
				ignoreScroll = false;
			}, 2000);
		}
	}


	$effect(() => {
		gsap.registerPlugin(ScrollTrigger);
		gsap.from('.box', {
			scrollTrigger: {
				trigger: '.box',
				toggleActions: 'restart pause revert none',
				start: 'top center',
				markers: true
			},
			x: -500,
			duration: 10
		});
	});


</script>

<svelte:head>
	<style>
      body {
          @apply bg-secondary-900;
      }
	</style>
</svelte:head>
<svelte:window bind:scrollY={scrollY} onscroll={handleScroll}></svelte:window>

<div bind:this={section_1}
		 class="mx-auto max-w-7xl pb-4 text-primary-200 md:pb-0 flex-grow flex flex-col space-y-10 min-h-screen "
>
	<h1 class="py-20 text-6xl font-bold tracking-tight text-primary-200">Alle vacatures in de GGZ
		<span
			class=" text-primary">voor zorgprofessionals.</span></h1>

	<div class="lg:grid lg:grid-cols-2 space-x-16">
		<div class="flex flex-col gap-4 pb-8 xl:gap-16">
			<h2 class="text-3xl/10">Je hebt geen tijd om alle vacatures in de gaten te houden. Daarom doen wij het voor
				je.</h2>
			<p class="text-xl/8 text-primary-200 font-serif text-justify">
				Voor professionals in de ggz is het moeilijk om een overzicht te krijgen van alle
				vacatures. Daarom maken wij dagelijks een samenvatting van de vacatures van alle GGZ instellingen. We zoeken
				naar de details die belangrijk zijn voor GGZ professionals en zetten deze voor jou op een rijtje. Wij zijn
				gg<span class="">zoek</span>: het startpunt van jouw zoektocht naar een nieuwe baan in de GGZ.
			</p>
		</div>
		<div
			class="sm:max-w-2xl sm:text-center lg:flex lg:items-center lg:text-left "
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
	<button onclick={() => section_2.scrollIntoView({behavior: "smooth", block: "center"})}>CLICK</button>
</div>

<div bind:this={section_2}
		 class="mt-20 text-primary-200 w-full bg-secondary-900 flex flex-col flex-grow items-center min-h-screen "
		 id="section2"
>
	<div class="flex flex-col  items-center justify-center box bg-yellow-300"
	>
		<p>MORE CONTENT HERE</p>
		<button onclick={() => section_1.scrollIntoView({behavior: "smooth", block: "center", inline:"center"})}>CLICK
		</button>
	</div>
</div>
<style>
    .slide-in {
        animation: slide-in 2s ease-out forwards;
    }

    :global(.whatever) {
        animation: appear 10s ease-out forwards;
        @apply bg-yellow-300;
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

    @keyframes appear {
        0% {
            opacity: 0;
        }
        100% {
            opacity: 1;
        }

    }


</style>

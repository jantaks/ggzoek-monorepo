<!--https://gsap.com/community/forums/topic/37467-the-issue-when-combining-scrolltrigger-and-scrollto-plugin/-->

<!--
Goed artikel over responsive design:
https://ishadeed.com/article/responsive-design-height/
-->


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
	import { ArrowLeft, ArrowRight } from 'lucide-svelte';
	import ViewPortDimensions from '$lib/components/ViewPortDimensions.svelte';

	let { data } = $props();

	let form = getSearchForm();

	function getBeroepAfkorting(beroep: string) {
		const mappings: Record<string, string> = {
			'sociaal psychiatrisch verpleegkundige': 'SPV'
		};
		const mapped = mappings[beroep.toLowerCase()];
		return mapped ? mapped : beroep;
	}

	let kpis = $derived.by(() => {
		return data.facets.beroepen.map((beroep) => {
			return { title: getBeroepAfkorting(beroep.value), number: beroep.count };
		});
	});

	$inspect(kpis);

	let skipAnimation = false;

	$effect(() => {
		if (skipAnimation) {
			return;
		}
		gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

		let panels = gsap.utils.toArray('.panel'),
			observer = ScrollTrigger.normalizeScroll(true),
			scrollTween;

		// on touch devices, ignore touchstart events if there's an in-progress tween so that touch-scrolling doesn't interrupt and make it wonky
		document.addEventListener(
			'touchstart',
			(e) => {
				if (scrollTween) {
					e.preventDefault();
					e.stopImmediatePropagation();
				}
			},
			{ capture: true, passive: false }
		);

		function goToSection(i) {
			scrollTween = gsap.to(window, {
				scrollTo: { y: i * innerHeight, autoKill: false },
				onStart: () => {
					observer.disable(); // for touch devices, as soon as we start forcing scroll it should stop any current touch-scrolling, so we just disable() and enable() the normalizeScroll observer
					observer.enable();
				},
				duration: 0.5,
				onComplete: () => (scrollTween = null),
				overwrite: true
			});
		}

		panels.forEach((panel, i) => {
			console.log('Creating ScrollTrigger for panel', i, panel);
			ScrollTrigger.create({
				trigger: panel,
				start: 'top bottom',
				end: '+=150%',
				onToggle: (self) => self.isActive && !scrollTween && goToSection(i)
			});
		});

		// just in case the user forces the scroll to an inbetween spot (like a momentum scroll on a Mac that ends AFTER the scrollTo tween finishes):
		ScrollTrigger.create({
			start: 0,
			end: 'max',
			snap: 1 / (panels.length - 1)
		});

		gsap
			.timeline()
			.to('#tagline', { opacity: 1, duration: 1, color: '#D1B87D' })
			.to('#tagline', { color: '#FEF9F0' })
			.set('#box-1', { opacity: 0, scale: 0 })
			.to('#box-1', {
				duration: 1,     // Animation duration
				scale: 1,        // Grows from 0 to full size
				rotation: 360,   // Completes a full circle
				ease: 'power2.out',
				opacity: 1// Easing function
			})
			.from(
				'#zoek-nu-1',
				{
					opacity: 0,
					x: '-20%',
					duration: 1,
					ease: 'elastic'
				},
				'+=0.5'
			);

		let tl = gsap.timeline();

		tl.to('#box-3', {
			opacity: '1',
			backgroundColor: '#3E4665',
			stagger: { amount: 2, from: 'random' },
			duration: 2
		}, '+=2')
			.from(
				'#storage-number',
				{
					innerText: 0,
					stagger: { amount: 1, from: 'random' },
					opacity: 0.5,
					duration: 2,
					ease: 'steps(25)',
					snap: {
						innerText: 1
					}
				},
				'<'
			)
			.to('#storage-number', {
				fontSize: '+=2',
				color: '#D1B87D',
				repeat: 1,
				duration: 0.7,
				yoyo: true
			})

			.from(
				'#zoek-nu-2',
				{
					opacity: 0,
					x: '20%',
					duration: 1.5,
					ease: 'elastic'
					// rotate: 10
				},
				'<'
			);

		ScrollTrigger.create({
			trigger: '#header-2',
			start: 'top 50%',
			end: 'top top',
			toggleActions: 'play none none none',
			animation: tl
		});

		return () => {
			ScrollTrigger.getAll().forEach((st) => st.kill());
			gsap.killTweensOf(window);
		};
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
<!--<ViewPortDimensions />-->
<div class="panel bg-secondary-900" id="section-1">
	<section class="flex flex-col -mt-10">
		<h1 class="~mb-0/20 ~text-4xl/5xl mt-14 font-bold tracking-tight text-primary-200 ">
			Alle vacatures in de GGZ
			<span class=" text-primary">voor zorgprofessionals.</span>
		</h1>
		<div class="grid grid-cols-2 gap-10">
			<div class="flex flex-col h-full max-w-xl gap-8" id="text-1">
				<div>
					<h2 class="~text-lg/4xl mb-4">
						Je hebt geen tijd om alle vacatures in de gaten te houden. <span
						class="opacity-0"
						id="tagline">Daarom doen wij het voor je.</span>
					</h2>
					<p class="text-justify font-serif ~text-base/2xl text-primary-200 font-light">
						Voor professionals in de ggz is het moeilijk om een overzicht te krijgen van alle
						vacatures. Daarom maken wij dagelijks een samenvatting van de vacatures van alle GGZ
						instellingen. We zoeken naar de details die belangrijk zijn voor GGZ professionals en
						zetten deze voor jou op een rijtje. Wij zijn gg<span class="">zoek</span>: het startpunt
						van jouw zoektocht naar een nieuwe baan in de GGZ.
					</p>
				</div>
				<div
					class="py-4 flex flex-row flex-grow items-end justify-end space-x-2 font-mono text-3xl text-primary-200"
					id="zoek-nu-1"
				>
					<p class=" font-thin decoration-wavy underline-offset-8 text-right">Start hier met ggzoeken</p>
					<ArrowRight class="w-12"></ArrowRight>
				</div>
			</div>
			<div
				class={`h-full ${skipAnimation? "opacity-100": "opacity-0"}  w-full justify-center item-center bg-gradient-to-r from-primary to-primary/90 ~p-1/4 text-primary-light shadow-2xl shadow-primary-400/70 rounded-xl`}
				id="box-1"
			>
				<div class="space-y-2 2xl:space-y-4  h-full flex-col flex justify-between">

					<div class="space-y-2">
						<SearchBox />


						<div class="pb-4">
							<PostCodeSelect />
						</div>
					</div>
					<div class="space-y-2">
						<FilterContainer facets={data.facets}></FilterContainer>
					</div>

					<ResultButton
						href={`/zoekresultaten?${$page.url.searchParams}`}
						isLoading={form.isLoading}
						totalHits={data.searchResponse.estimatedTotalHits >= 1000
								? data.indexSize
								: data.searchResponse.estimatedTotalHits}
					/>
				</div>
			</div>

			<!--{/if}-->
		</div>
	</section>
</div>

{#snippet kpi(title, number)}
	{@const clazz = `${skipAnimation ? 'bg-secondary-900 text-primary-200' : ''}`}
	<a href={'/zoekresultaten?filters=' + encodeURIComponent(`(beroepen = "${title}")`)}>
		<div
			id="box-3"
			class={`fluid-box rounded border border-primary p-2 line-clamp-1 hyphens-auto ${clazz}`}
		>
			<div class="title grid grid-rows-2 h-full">
				<!-- First row, text at the top -->
				<div class=" text-center justify-center flex items-center h-full" lang="nl">
					{title}
				</div>

				<!-- Second row, text at the bottom -->
				<div class="content text-center justify-center flex items-center h-full"
						 id="storage-number">
					{number}
				</div>
			</div>
		</div>

	</a>
{/snippet}

<div class="panel bg-primary-200">
	<section id="section-2 -mt-10">
		<div class="grid w-full grid-cols-2 gap-10">
			<div class="grid grid-cols-3 items-center gap-1 2xl:gap-3">
				{#each kpis as { title, number }}
					{@render kpi(title, number)}
				{/each}
			</div>


			<div class="flex w-full max-w-xl flex-col gap-8 text-secondary-900">
				<h2 class="text-3xl/10" id="header-2">Iedereen op de juiste plek. Dat is onze missie.</h2>
				<p class="text-justify font-serif text-xl/8 font-light hyphens-auto" lang="nl">
					De GGZ kampt met een groot capaciteitsprobleem. Veel professionals ervaren een (te) hoge
					werkdruk. Dit gaat ten koste van werkplezier, kwaliteit van zorg en de gezondheid van de
					professional. Uiteindelijk komt dit ook de productiviteit niet ten goede. Door er voor te
					zorgen dat zoveel mogelijk professionals op de juiste plek terecht komen, draagt ggzoek
					een steentje bij aan het oplossen van dit probleem.
				</p>
				<div
					class="h-full w-full items-center flex flex-row  space-x-2 font-mono text-3xl text-black"
					id="zoek-nu-2"
				>
					<ArrowLeft></ArrowLeft>
					<p class="font-thin decoration-wavy underline-offset-8">Klik een beroep om te ggzoeken</p>
				</div>
			</div>
		</div>
	</section>
</div>
<div class="panel bg-secondary-900" id="section-3">
	<section class="grid w-full grid-cols-2 justify-between gap-10 text-white">
		<div class="flex w-full max-w-xl flex-col gap-8 text-primary-200">
			<h2 class="text-3xl/10">Vind je niet wat je zoekt? Wij helpen je graag.</h2>
			<p class="text-justify font-serif text-xl/8 text-primary-200" id="uitdagingen">
				GGZoek gaat graag met je in gesprek over jouw wensen en uitdagingen.
			</p>
		</div>
		<div class="flex min-h-[50vh] flex-col items-center" id="img-5">
			hallo daar
			<!--			<img alt="Jan Taks" class="" src="/karin.png" />-->
			<!--			<img alt="Jan Taks" class="" src="/boef.png" />-->
		</div>
	</section>
</div>

<style>
    section {
        @apply mx-auto w-full max-w-7xl py-10;
    }

    .panel {
        @apply flex flex-col items-center justify-center px-4 -mt-4;
        height: 100vh;
    }

    :global(.glowing) {
        @apply rounded-xl;
        animation: glow 2s ease-out forwards;
    }

    :global(.fluid-box) {
        height: clamp(10vh, 11vh, 12vh); /* Adjusts between 10vh and 12vh depending on viewport size */
        padding: 1rem;
    }

    :global(.fluid-box .title) {
        font-size: clamp(1rem, 2vh, 1.2rem); /* Scales from 1rem to a maximum of 1.2rem based on viewport height */
        font-weight: normal;
        line-height: 1.3rem; /* Adjust the line height to ensure readability */
    }

    :global(.fluid-box .content) {
        font-size: clamp(1rem, 3vh, 2.5rem); /* Scales from 0.8rem to a maximum of 2.5rem based on viewport height */
        font-weight: normal;
    }

    @keyframes glow {
        0% {
            box-shadow: 0 0 0 #fef9f0,
            inset 0 0 0,
            0 0 0 #1f2023;
        }
        50% {
            box-shadow: 0 0 30px #d7b93b,
            inset 0 0 0,
            0 0 0 #ea8bfc;
        }
        100% {
            box-shadow: 0 0 0 #fef9f0,
            inset 0 0 0,
            0 0 0 #1f2023;
        }
    }
</style>

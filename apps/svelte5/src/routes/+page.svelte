<!--https://gsap.com/community/forums/topic/37467-the-issue-when-combining-scrolltrigger-and-scrollto-plugin/-->

<!--
Goed artikel over responsive design:
https://ishadeed.com/article/responsive-design-height/
-->

<script lang="ts">
	import SearchBox from '$lib/components/searchform/SearchBox.svelte';
	import KpiCard from '$lib/components/KpiCard.svelte';
	import FilterContainer from '$lib/components/searchform/FilterContainer.svelte';
	import PostCodeSelect from '$lib/components/searchform/PostCodeSelect.svelte';
	import ResultButton from '$lib/components/searchform/ResultButton.svelte';
	import { getSearchForm } from '$lib/stores/formStore.svelte.js';
	import { page } from '$app/stores';
	import { gsap } from 'gsap';
	import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
	import { ScrollToPlugin } from 'gsap/dist/ScrollToPlugin';
	import { ArrowLeft, ArrowRight } from 'lucide-svelte';

	let { data } = $props();

	let form = getSearchForm();

	function getBeroepAfkorting(beroep: string) {
		const mappings: Record<string, string> = {
			'sociaal psychiatrisch verpleegkundige': 'SPV',
			'gedragswetenschapper': 'Gedrags&shy;weten&shy;schapper',
			'systeemtherapeut': 'Systeem&shy;thera&shy;peut',
			'basispsycholoog': 'Basis&shy;psycholoog'
		};
		const mapped = mappings[beroep.toLowerCase()];
		return mapped ? mapped : beroep;
	}

	let kpis = $derived.by(() => {
		return data.facets.beroepen.map((beroep) => {
			return {
				title: getBeroepAfkorting(beroep.value),
				number: beroep.count,
				href: `/zoekresultaten?filters=${encodeURIComponent(`(beroepen = "${beroep.value}")`)}`
			};
		});
	});

	let skipAnimation = $state(false);

	$effect(() => {
		const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		const isMobile = window.matchMedia('(max-width: 768px)').matches;

		skipAnimation = prefersReducedMotion || isMobile;

		if (skipAnimation) {
			console.log('Reduced motion preference or mobile device detected. Skipping animations.');
			return;
		}

		gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

		let panels = gsap.utils.toArray('.panel');
		let observer = ScrollTrigger.normalizeScroll(true);
		let scrollTween: gsap.core.Tween | null = null;

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

		function goToSection(i: number) {
			scrollTween = gsap.to(window, {
				scrollTo: { y: i * innerHeight, autoKill: false },
				onStart: () => {
					if (observer) {
						observer.disable(); // for touch devices, as soon as we start forcing scroll it should stop any current touch-scrolling, so we just disable() and enable() the normalizeScroll observer
						observer.enable();
					}
				},
				duration: 0.5,
				onComplete: () => (scrollTween = null),
				overwrite: true
			});
		}

		panels.forEach((panel, i) => {
			console.log('Creating ScrollTrigger for panel', i, panel);
			ScrollTrigger.create({
				trigger: panel as gsap.DOMTarget,
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
				duration: 1, // Animation duration
				scale: 1, // Grows from 0 to full size
				rotation: 360, // Completes a full circle
				ease: 'power2.out',
				opacity: 1 // Easing function
			})
			.to('#box-1', {
				boxShadow: '0 0 30px #d7b93b',
				duration: 0.5,
				yoyo: true,
				repeat: 1,
				ease: 'power2.inOut'
			})
			.from(
				'#zoek-nu-1',
				{
					opacity: 0,
					x: '-20%',
					duration: 1,
					ease: 'elastic'
				},
				'-=0.5'
			);


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
	<section class="-mt-10 flex flex-col">
		<h1 class="mt-[5vh] text-primary-200 heading-large">
			Alle vacatures in de GGZ
			<span class=" text-primary">voor zorgprofessionals.</span>
		</h1>
		<div class="gap-10 md:grid md:grid-cols-2">
			<div class="flex h-full max-w-xl flex-col gap-8" id="text-1">
				<div>
					<h2 class="mb-4 heading-medium">
						Je hebt geen tijd om alle vacatures in de gaten te houden. <span
						class={`${skipAnimation ? 'opacity-100' : 'opacity-0'}`}
						id="tagline">Daarom doen wij het voor je.</span
					>
					</h2>
					<p class="hyphens-auto text-justify font-serif font-light text-primary-200 ~text-base/2xl">
						GGZoek maakt dagelijks een samenvatting van de vacatures van alle GGZ
						instellingen. We zoeken naar de details die belangrijk zijn voor GGZ professionals en
						zetten deze voor jou op een rijtje. Wij zijn gg<span class="">zoek</span>: het startpunt
						van jouw zoektocht naar een nieuwe baan in de GGZ.
					</p>
				</div>
				<div
					class="hidden md:flex flex-grow flex-row items-end justify-end space-x-2 py-4 font-mono text-3xl text-primary-200"
					id="zoek-nu-1"
				>
					<p class=" text-right font-thin decoration-wavy underline-offset-8">
						Start hier met ggzoeken
					</p>
					<ArrowRight class="w-12"></ArrowRight>
				</div>
				<div class="flex md:hidden flex-col items-center justify-center">
					<ResultButton
						href={`/zoekresultaten?${$page.url.searchParams}`}
						isLoading={form.isLoading}
						totalHits={data.searchResponse?.estimatedTotalHits !== undefined
						? data.searchResponse.estimatedTotalHits >= 1000
							? data.indexSize
							: data.searchResponse.estimatedTotalHits
						: undefined}
						twBgColor="bg-secondary-300"
						twTextColor="text-primary-200"
					/>
				</div>
			</div>
			<div
				class={`h-full ${skipAnimation ? 'opacity-100' : 'opacity-0'} item-center hidden w-full justify-center rounded-xl bg-gradient-to-r from-primary to-primary/90 text-primary-light shadow-2xl shadow-primary-400/70 ~p-1/4 md:block`}
				id="box-1"
			>
				<div class="flex h-full flex-col justify-between space-y-2 2xl:space-y-4">
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
						totalHits={data.searchResponse?.estimatedTotalHits !== undefined
							? data.searchResponse.estimatedTotalHits >= 1000
								? data.indexSize
								: data.searchResponse.estimatedTotalHits
							: undefined}
						twBgColor="bg-secondary-900"
					/>
				</div>
			</div>

			<!--{/if}-->
		</div>
	</section>
</div>


<div class="panel bg-primary-200">
	<section id="section-2 md:-mt-10 ">
		<div class="md:hidden text-secondary-900">
			<h2 class=" heading-large">
				Iedereen op de juiste plek. Dat is onze missie.</h2>
		</div>
		<div class="w-full gap-10 md:grid md:grid-cols-2 space-y-4">
			<div class="grid max-h-screen grid-cols-3 items-center gap-1 2xl:gap-3">
				{#each kpis as { title, number, href }}
					<KpiCard title={title} number={number} href={href} animate={!skipAnimation} />
				{/each}
			</div>

			<div class="flex w-full max-w-xl flex-col gap-8 text-secondary-900">
				<h2 class="hidden md:block heading-large" id="header-2">Iedereen op de juiste plek. Dat is onze missie.</h2>
				<p class="hyphens-auto text-justify font-serif font-light text-secondary-900 ~text-base/2xl"
					 lang="nl">
					De GGZ kampt met een groot capaciteitsprobleem. Veel professionals ervaren een (te) hoge
					werkdruk. Dit gaat ten koste van werkplezier, kwaliteit van zorg en de gezondheid van de
					professional. Uiteindelijk komt dit ook de productiviteit niet ten goede. Door er voor te
					zorgen dat zoveel mogelijk professionals op de juiste plek terecht komen, draagt ggzoek
					een steentje bij aan het oplossen van dit probleem.
				</p>
				<div
					class="hidden md:flex h-full w-full flex-row items-center space-x-2 font-mono text-3xl text-black"
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
	<section class="md:grid w-full md:grid-cols-2 justify-between gap-10 text-white">
		<div class="flex w-full max-w-xl flex-col gap-8 text-primary-200">
			<h2 class="heading-large">Weet je niet zeker wat je zoekt? Wij helpen je graag.</h2>
			<p class="hyphens-auto  font text-justify font-serif font-light text-primary-200 ~text-base/2xl content"
				 id="uitdagingen">
				Je kiest niet voor niets voor werken in de GGZ. Je wilt iets betekenen voor mensen die het nodig hebben. Voor
				jou is werken meer dan een manier om
				de kost te verdienen. De juiste baan vinden is daarom belangrijk voor je en je wilt geen overhaaste beslissingen
				nemen. Wij weten dat en ondersteunen je graag in jouw zoektocht. Hieronder lees je meer over wie wij zijn en hoe
				wij werken.
			</p>
		</div>
		<div class="flex min-h-[50vh] flex-col items-center" id="img-5">

			<!--			<img alt="Jan Taks" class="" src="/karin.png" />-->
			<!--			<img alt="Jan Taks" class="" src="/boef.png" />-->
		</div>
	</section>
</div>

<style lang="postcss">
    section {
        @apply mx-auto w-full max-w-7xl py-10;
    }

    .heading-large {
        @apply ~text-3xl/5xl font-bold tracking-tight mb-[2vh] md:mb-[7vh]
    }

    .heading-medium {
        @apply ~text-2xl/3xl;
    }

    .panel {
        @apply -mt-4 flex flex-col items-center justify-center px-4;
        @media (min-width: 768px) {
            min-height: 100vh;
        }
    }


</style>

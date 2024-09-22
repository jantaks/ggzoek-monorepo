<script lang="ts">

	import { gsap } from 'gsap';
	import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
	import { ScrollToPlugin } from 'gsap/dist/ScrollToPlugin';

	type Props = {
		title: string;
		number: number;
		href: string;
		animate: boolean;
	}

	let { title, number, href, animate }: Props = $props();

	let clazz = animate ? '' : 'bg-secondary-900 text-primary-200';

	let element: HTMLElement | null = $state(null);

	//create a unique idenfifier for this component
	const id = Math.random().toString(36).substring(7);

	$effect(() => {
		if (!animate) return;
		gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

		let tl = gsap.timeline();

		tl.to(
			element,
			{
				opacity: '1',
				backgroundColor: '#3E4665',
				stagger: { amount: 2, from: 'random' },
				duration: 1,
				delay: Math.random() * 1
			}
		)
			.from(
				`#value-${id}`,
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
			.to(`#value-${id}`, {
				fontSize: '+=2',
				color: '#D1B87D',
				repeat: 1,
				duration: 0.7,
				yoyo: true
			});


		ScrollTrigger.create({
			trigger: element,
			start: 'top bottom',
			end: 'top top',
			toggleActions: 'restart none none none',
			animation: tl
		});
	});

</script>

<a {href}>
	<div
		bind:this={element}
		class={`fluid-box rounded border border-primary p-2 ${clazz}`}
		id={`${id}`}
	>
		<div class="title grid h-full grid-rows-2">
			<!-- First row, text at the top -->
			<div class=" flex h-full items-center justify-center text-center hyphens-auto" lang="nl">
				{@html title}
			</div>

			<!-- Second row, text at the bottom -->
			<div
				class="content flex h-full items-center justify-center text-center"
				id={`value-${id}`}
			>
				{number}
			</div>
		</div>
	</div>
</a>

<style lang="postcss">
    .container {
        container-type: inline-size;
    }

    .fluid-box {
        container-type: inline-size;
        height: clamp(13vh, 13vh, 30rem); /* Adjusts based on container query inline size */
    }

    .fluid-box .title {
        font-size: clamp(14px, 15cqi, 20px); /* Scales based on container query inline size */
        font-weight: normal;
        line-height: 1.15rem;
    }

    .fluid-box .content {
        font-size: clamp(12px, 20cqi, 30px); /* Scales based on container query inline size */
        font-weight: normal;
    }
</style>
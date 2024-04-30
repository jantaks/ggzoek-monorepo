<script lang="ts">
	import Siema from 'siema';
	import { onDestroy, onMount } from 'svelte';
	import { v4 as uuidv4 } from 'uuid';

	export let imageUrls: string[];
	export let delay: number;
	let slider: Siema;
	let interval: number;
	// Create a copy of imageUrls and shuffle it
	let shuffledImageUrls = [...imageUrls].sort(() => Math.random() - 0.5);
	let componentId = uuidv4();

	// Get the first 10 elements of the shuffled array
	let randomUrls = shuffledImageUrls.slice(0, 5);
	let selector;
	onMount(() => {
		slider = new Siema({
			selector: selector,
			duration: 500,
			easing: 'ease-in-out',
			perPage: 1,
			startIndex: 0,
			draggable: true,
			multipleDrag: true,
			threshold: 20,
			loop: true,
			rtl: false,
			onInit: () => {

			},
			onChange: () => {
				let imageEl = document.getElementById(`${componentId}-${slider.currentSlide}`) as HTMLImageElement;
				if (imageEl) {
					imageEl.src = shuffledImageUrls[slider.currentSlide];
				}
			}
		});
	});

	interval = setInterval(() => {
		slider.next();
		delay = delay * 1.2;
	}, delay);

	onDestroy(() => {
		clearInterval(interval);
	});


</script>

<!--https://svelte.dev/examples/deferred-transitions-->

<div class="max-w-48">
	<div class="mockup-phone -rotate-0 max-w-xs  shadow-md shadow-primary">
		<div class="camera"></div>
		<div bind:this={selector} class="display pt-8 pb-10 bg-white -z-50 w-[273px] h-[543px]">
			{#each randomUrls as url, index (url)}
				<img src={randomUrls[0]} alt="image" id="{componentId}-{index}" />
			{/each}
		</div>
	</div>
</div>
<script lang="ts">
	import { slide } from 'svelte/transition';

	export let imageUrls: string[];
	import PhoneCarousel from '$lib/components/PhoneCarousel.svelte';
	import Caroursel from '$lib/components/Caroursel.svelte';
</script>
<div class="hero  bg-transparent flex flex-col items-center justify-center">
	<div class="hero-content text-center flex flex-col ">
		<div class="lg:max-w-5xl flex flex-col items-center lg:pb-12">
			<h1 class="text-4xl lg:text-5xl font-bold">Alle vacatures binnen de GGZ onder een dak</h1>
			<div class="py-3 lg:py-6 lg:w-4/5 lg:text-2xl font-light space-y-0.5">
				<p>De GGZ kampt met veel openstaande vacatures. </p>
				<p>Tegelijkertijd voelen veel professionals dat ze niet op de juiste plek zitten.</p>
				<p><em>Het is onze missie om iedereen zijn of haar plek te laten vinden.</em></p>
			</div>

		</div>
		<div class="flex flex-row">
			<div class="hidden lg:flex relative -left-20 -rotate-12">
				<Caroursel imageUrls={imageUrls} delay=2000 />
			</div>
			<div class="hidden sm:flex relative -left-10 rotate-0">
				<Caroursel imageUrls={imageUrls} delay=11000/>
			</div>
			<div class="hidden lg:flex relative left-0 rotate-12">
				<Caroursel imageUrls={imageUrls} delay=10000/>
			</div>

		</div>
	</div>
	<div class="p-10">
		<slot></slot>
	</div>

</div>
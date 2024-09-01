<script lang="ts">
	import { ChevronsUp } from 'lucide-svelte';


	const showOnPx = 50;
	let hidden = $state(true);
	let scrollContainer: Element | null = null;

	type Props = {
		message: string;
		// How the element should look when not scrolling
		class?: string;
		// How the element should look while scrolling
		scrollingClass?: string;
	}

	let { message, class: className, scrollingClass }: Props = $props();

	function goTop() {
		document.body.scrollIntoView();
	}

	function scroll(el: Element) {
		scrollContainer = el;
	}


	let scrolling = $state(false);

	function handleOnScroll() {
		if (!scrollContainer) return;
		scrolling = true;
		hidden = scrollContainer.scrollTop <= showOnPx;
	}

</script>

<style>
    .back-to-top {
        @apply transition-all duration-300 ease-in-out;
        z-index: 99;
        user-select: none;
        color: white;
    }

</style>

<svelte:document on:scroll={handleOnScroll} on:scrollend={() => {scrolling=false}} use:scroll />

{#if !hidden}
	<div class="flex flex-row justify-center fixed bottom-4 w-full text-white">
		<button
			class={`flex flex-row items-center back-to-top p-3 rounded-lg mx-4 shadow-lg ` + `${scrolling? scrollingClass : className}`}
			onclick={goTop}>
			<ChevronsUp class="min-w-8" />
			{message}
		</button>
	</div>
{/if}

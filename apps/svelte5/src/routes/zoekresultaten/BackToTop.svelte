<script lang="ts">
	import { ChevronsUp } from 'lucide-svelte';
	import { fade } from 'svelte/transition';


	const showOnPx = 50;
	let hidden = $state(true);
	let scrolling = $state(false);
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

	let timeout: NodeJS.Timeout;

	function handleOnScroll() {
		if (!scrollContainer) return;
		clearTimeout(timeout);
		scrolling = true;
		hidden = scrollContainer.scrollTop <= showOnPx;
	}

	function handleScrollEnd() {
		clearTimeout(timeout);
		scrolling = false;
		timeout = setTimeout(() => {
			hidden = true;
		}, 3000);
	}

</script>

<svelte:document on:scroll={handleOnScroll} on:scrollend={handleScrollEnd} use:scroll />

{#if !hidden && scrolling}
	<div class="flex flex-row justify-center fixed bottom-4 right-0  w-full text-white" transition:fade>
		<button
			class={`flex flex-row items-center back-to-top p-3 rounded-lg mx-4 shadow-lg ` + scrollingClass}
			onclick={goTop}>
			<ChevronsUp class="min-w-8" />
			{message}
		</button>
	</div>
{/if}
{#if !hidden && !scrolling}
	<div class="flex flex-row justify-center fixed bottom-4 left-0 w-full text-white" transition:fade>
		<button
			class={`flex flex-row items-center back-to-top p-3 rounded-lg mx-4 shadow-lg ` + className}
			onclick={goTop}>
			<ChevronsUp class="min-w-8" />
			{message}
		</button>
	</div>
{/if}

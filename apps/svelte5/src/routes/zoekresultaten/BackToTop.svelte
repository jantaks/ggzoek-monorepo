<script lang="ts">
	import { ChevronsUp } from 'lucide-svelte';
	import { browser } from '$app/environment';


	const showOnPx = 50;
	let hidden = $state(true);

	type Props = {
		message: string;
		class?: string;
	}

	let { message, class: className }: Props = $props();

	$inspect(hidden);

	function goTop() {
		document.body.scrollIntoView();
	}

	function scrollContainer() {
		return document.documentElement || document.body;
	}

	function handleOnScroll() {
		if (!scrollContainer()) {
			return;
		}

		if (scrollContainer().scrollTop > showOnPx) {
			hidden = false;
		} else {
			hidden = true;
		}
	}

	const onScrollStop = callback => {
		if (!browser) {
			return;
		}
		let isScrolling;
		window.addEventListener(
			'scroll',
			e => {
				clearTimeout(isScrolling);
				isScrolling = setTimeout(() => {
					callback();
				}, 300);
			},
			false
		);
	};

	let animate = $state(false);

	onScrollStop(() => {
		let t;
		animate = true;
		clearTimeout(t);
		t = setTimeout(() => {
			animate = false;
		}, 1000);
	});
</script>

<style>
    .back-to-top {
        @apply transition-all duration-300 ease-in-out;
        z-index: 99;
        user-select: none;
        color: white;
    }

    .bounce {
        animation: bounce 1s ease-in-out 1;
    }

    @keyframes bounce {
        0%, 40%, 80%, 100% {
            transform: translateY(0);
        }
        20% {
            transform: translateY(-10px);
        }
        60% {
            transform: translateY(-10px);
        }
    }
</style>

<svelte:window on:scroll={handleOnScroll} />


{#if !hidden && animate}
	<button
		class={"bounce flex flex-row items-center back-to-top p-3 opacity-100 bg-primary fixed bottom-4 left-4 rounded-full shadow-lg transition-all duration-300 ease-in-out " +className }
		onclick={goTop}>
		<ChevronsUp class="min-w-8" />
		{message}
	</button>
{:else if !hidden}
	<button
		class={"flex flex-row items-center back-to-top p-3 opacity-100 bg-primary fixed bottom-4  rounded-full shadow-lg transition-all duration-300 ease-in-out " +className }
		onclick={goTop}>
		<ChevronsUp class="min-w-8" />
		{message}
	</button>
{/if}

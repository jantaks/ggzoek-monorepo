<script>
	import { ChevronsUp } from 'lucide-svelte';
	import { browser } from '$app/environment';


	const showOnPx = 150;
	let hidden = $state(true);

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

	let animateChevrons = $state(false);

	onScrollStop(() => {
		let t;
		console.log('scrolling stopped');
		animateChevrons = true;
		clearTimeout(t);
		t = setTimeout(() => {
			console.log('stop animating');
			animateChevrons = false;
		}, 1000);
	});
</script>

<style>
    .back-to-top {
        @apply opacity-100 bg-primary fixed bottom-4 left-4 rounded-full shadow-lg;
        @apply transition-all duration-300 ease-in-out;
        position: fixed;
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

{#if !hidden && animateChevrons}
	<button class="back-to-top p-3 justify-items-center rounded-lg bounce" on:click={goTop}>
		<ChevronsUp class="size-8" />
	</button>
{:else if !hidden}
	<button class="back-to-top p-3 justify-items-center rounded-lg" on:click={goTop}>
		<ChevronsUp class="size-8" />
	</button>
{/if}
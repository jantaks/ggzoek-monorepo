<script lang="ts">
	import { ChevronsUp } from 'lucide-svelte';
	import '@af-utils/scrollend-polyfill'; // polyfill for scrollend event in safari


	let hidden = $state(true);
	let scrolling = $state(false);
	let scrollContainer: Element | null = null;


	type Props = {
		message: string;
		tailwindBgColor: string;
	}

	let { message, tailwindBgColor: tailwindBgColor }: Props = $props();

	function goTop() {
		document.body.scrollIntoView();
	}

	function scroll(el: Element) {
		scrollContainer = el;
	}

	function onscroll() {
		clearTimeout(timeout);
		if (!scrollContainer) return;
		scrolling = true;
		hidden = false;
	}

	let timeout: ReturnType<typeof setTimeout> | undefined;

	let bgColor = $derived.by(() => {
			if (scrolling) {
				return `${tailwindBgColor}/50`;
			}
			return tailwindBgColor;
		}
	);

</script>

<svelte:document on:scroll={onscroll} on:scrollend={()=> scrolling=false} use:scroll />

{#if !hidden}
	{#key scrolling}
		<div class={`flex flex-row justify-center fixed bottom-4 right-0  w-full text-white ${scrolling? "":" fade-out"}`}>
			<button
				class={`flex flex-row items-center back-to-top p-3 rounded-lg mx-4 shadow-lg ${bgColor}`}
				onclick={goTop}>
				<ChevronsUp class="min-w-8" />
				{message}
			</button>
		</div>
	{/key}
{/if}

<style>


    .fade-in {
        animation: fadeIn 1s;
    }

    .fade-out {
        animation: fadeOut 1s forwards;
        animation-duration: 5s;
    }

    @keyframes fadeIn {
        from {
            opacity: 0.5;
        }
        to {
            opacity: 1;
        }
    }

    @keyframes fadeOut {
        0% {
            opacity: 0.5;
        }
        25% {
            opacity: 1;
        }
        75% {
            opacity: 1;
        }
        100% {
            opacity: 0;
        }
    }

</style>

<script lang="ts">
	import { ChevronsUp } from 'lucide-svelte';
	import '@af-utils/scrollend-polyfill'; // polyfill for scrollend event in safari

	let hidden = $state(true);
	let scrolling = $state(false);

	type Props = {
		message: string;
		tailwindBgColor: string;
	}

	let { message, tailwindBgColor: tailwindBgColor }: Props = $props();

	function goTop() {
		document.body.scrollIntoView();
	}

	let timeout: ReturnType<typeof setTimeout> | undefined;

	function onscroll() {
		clearTimeout(timeout);
		scrolling = true;
		hidden = false;
	}

	let bgColor = $derived.by(() => {
			if (scrolling) {
				return `${tailwindBgColor}/50`;
			}
			return tailwindBgColor;
		}
	);

</script>

<svelte:document on:scroll={onscroll} on:scrollend={()=> scrolling=false} />

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

    .fade-out {
        animation: fadeOut 1s forwards;
        animation-duration: 5s;
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

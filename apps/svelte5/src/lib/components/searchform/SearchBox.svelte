<script lang="ts">
	import { getSearchForm } from '$lib/stores/formStore.svelte';
	import { page } from '$app/stores';
	import { MapPin, Search, X } from 'lucide-svelte';

	let form = getSearchForm();

	type Props = {
		actionUrl?: string;
	};

	let { actionUrl }: Props = $props();

	form.query = $page.url.searchParams.get('fullText') ?? '';

	const delayedSubmit = (delay: number) => {
		let timeout: number;
		return () => {
			clearTimeout(timeout);
			timeout = setTimeout(() => {
				form.submit({ actionUrl: actionUrl });
			}, delay);
		};
	};
</script>

<label class="mb-2 font-medium text-gray-900 sr-only dark:text-white" for="default-search">Zoeken</label>
<div class="relative w-full">
	<div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
		<Search class="size-6 text-secondary-900/50"></Search>
	</div>
	{#if form.query}
		<button class="absolute inset-y-0 end-2 flex items-center ps-3 cursor-pointer"
						onclick={()=> form.query = ''}>
			<X class="size-6 text-secondary-900" onclick={()=> {form.query = ''; form.submit()}}></X>
		</button>
	{/if}
	<input
		bind:value={form.query}
		class="bg-primary-200 rounded glowing border-primary-light block w-full p-4 h-10 ps-10 text-gray-900 border  bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
		data-sveltekit-keepfocus
		id="default-search"
		oninput={delayedSubmit(1000)}
		placeholder="Zoek tekst, beroep, locatie, ..."
		type="text" />
</div>

<style>
    .glowing {
        animation: glow 1200ms ease-out infinite alternate;
    }

    @keyframes glow {
        0% {
            box-shadow: 0 0 0 #fef9f0, inset 0 0 0, 0 0 0 #1f2023;
        }
        100% {
            box-shadow: 0 0 20px #d7b93b, inset 0 0 0, 0 0 0 #ea8bfc;
        }
    }
</style>

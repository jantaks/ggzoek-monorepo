<script lang="ts">
	import { getSearchForm } from '$lib/stores/formStore.svelte';

	let form = getSearchForm();

	const delayedSubmit = (delay: number) => {
		let timeout: number;
		return () => {
			clearTimeout(timeout);
			timeout = setTimeout(() => {
				form.submit();
				console.log('submit');
			}, delay);
		};
	};
</script>

<label class="mb-2  font-medium text-gray-900 sr-only dark:text-white" for="default-search">Zoeken</label>
<div class="relative">
	<div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
		<svg aria-hidden="true" class="w-4 h-4 text-secondary dark:text-gray-400" fill="none"
				 viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
			<path d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" stroke="currentColor" stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="3" />
		</svg>
	</div>
	<input
		bind:value={form.query}
		class="glowing border-primary-light block w-full p-4 h-10 ps-10 text-gray-900 border rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
		id="default-search"
		oninput={delayedSubmit(1000)}
		placeholder="Zoek tekst, beroep, locatie, ..."
		required type="search" />
</div>

<style>
    .glowing {
        animation: glow 1200ms ease-out infinite alternate;
    }

    @keyframes glow {
        0% {
            box-shadow: 0 0 0px #F17EB8, inset 0 0 0, 0 0 0 #ea8bfc;
        }
        100% {
            box-shadow: 0 0 5px #F17EB8, inset 0 0 0, 0 0 0 #ea8bfc;
        }
    }
</style>

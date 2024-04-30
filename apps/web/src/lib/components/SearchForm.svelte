<script lang="ts">
	import Filter from '$lib/components/Filter.svelte';
	import { page } from '$app/stores';
	import { Accordion } from '@skeletonlabs/skeleton';

	let data = $page.data;
	let timeout = 0;
	let showAccordion = false;
	let accordionElement: HTMLDivElement;
	$: {
		if (showAccordion) accordionElement?.classList.remove('hidden'); else accordionElement?.classList.add('hidden');
	}

	async function delay(event) {
		clearTimeout(timeout);
		timeout = setTimeout(() => {
			event.target.form.requestSubmit();
		}, 1000);
	}
</script>
<form class="p-4 w-full" action="/">
	<div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
		<div class="input-group-shim"><span class="icon-[mdi--search]"></span></div>

		<input type="search" placeholder="trefwoorden" autofocus name="search"
					 value={data.searchCommand?.query ? data.searchCommand?.query : ''}
					 on:input={delay} />
		<button class="variant-filled-primary">Zoek</button>
	</div>
	<div class="py-4"></div>

	{#if data.response?.facetDistribution}
		<button class="lg:hidden btn btn-sm" on:click={() => showAccordion =!showAccordion}>Toon filters</button>
		<div class="hidden lg:block" bind:this={accordionElement}>
			<Accordion>
				{#each Object.keys(data.response?.facetDistribution) as category}
					<Filter filters={data.response?.facetDistribution[category]} category={category} />
				{/each}
			</Accordion>
		</div>
	{/if}
</form>
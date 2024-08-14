<script lang="ts">
	import { type facet } from '$lib/types';
	import type { getFacets } from '$lib/components/searchform/search';
	import { Label, Slider } from 'bits-ui';
	import FacetSelectFilterNew from '$lib/components/searchform/FacetSelectFilterNew.svelte';
	import PostCodeSelect from '$lib/components/searchform/PostCodeSelect.svelte';

	const x = { Slider, Label };


	type Props = {
		facets: Awaited<ReturnType<typeof getFacets>>,
		class?: string
	}

	let { class: className, facets }: Props = $props();

	let allFacets = Object.keys(facets) as facet[];


</script>

<div class={"sm:p-4 space-y-4 justify-left bg-primary rounded-xl shadow-xl " + className}>
	<PostCodeSelect></PostCodeSelect>

	<div class="sm:space-y-4">
		{#each allFacets as facet}
			<FacetSelectFilterNew facets={facets[facet]}
														filterLabel={facet}></FacetSelectFilterNew>
		{/each}
	</div>
</div>
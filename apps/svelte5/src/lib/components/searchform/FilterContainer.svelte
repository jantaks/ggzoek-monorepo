<script lang="ts">
	import type { getFacets } from '$lib/search';
	import FacetSelectFilterv3 from '$lib/components/searchform/FacetSelectFilterv3.svelte';

	type Props = {
		facets: Awaited<ReturnType<typeof getFacets>>,
	}

	let { facets }: Props = $props();

	let allFacets = Object.keys(facets) as facet[];

</script>
{#each allFacets as facet, i (facet)}
	<FacetSelectFilterv3 facets={facets[facet]}
											 filterLabel={facet}
											 id={i}
	>
	</FacetSelectFilterv3>
{/each}
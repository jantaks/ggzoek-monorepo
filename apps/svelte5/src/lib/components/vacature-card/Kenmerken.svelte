<script lang="ts">
	import type { Hit } from 'meilisearch';
	import type { SelectVacature } from '@ggzoek/ggz-drizzle/dist/schema';
	import { DATE_TIME_FORMATTING } from '$lib/constants';

	type Props = {
		hit: Hit<SelectVacature>
	};

	const { hit }: Props = $props();

</script>
{#snippet row(title, value)}
	<div class="grid grid-cols-2 items-center border-b border-b-gray-300 py-1 ">
		<h3 class="truncate">{title}:</h3>
		<p class="text-wrap truncate">{value || 'onbekend' }</p>
	</div>
{/snippet}
<div class="bg-transparent">
	<div class="grid grid-cols-1 lg:grid-cols-2 items-start cols-auto gap-2 w-full">
		<div class="h-full bg-transparent mt-2">
			<h2 class="font-semibold mb-2 border-b border-b-gray-300 py-1">Arbeidsvoorwaarden</h2>
			{@render row("CAO", hit.cao)}
			{@render row("Functiegroep", hit.fwg)}
			{@render row("Salaris", hit.salarisMin ? `€${hit.salarisMin} - €${hit.salarisMax}` : undefined)}
		</div>
		<div class="h-full bg-transparent mt-2">
			<h2 class="font-semibold mb-2 border-b border-b-gray-300 py-1">Inhoudelijk</h2>
			{@render row("Behandelmethoden", hit.behandelmethoden?.join(", "))}
			{@render row("Stoornissen", hit.stoornissen?.join(", "))}
			{@render row("Beroepen", hit.beroepen?.join(", "))}
			{@render row("Eerst gezien", new Date(hit.firstScraped).toLocaleDateString("nl-NL", DATE_TIME_FORMATTING))}
			{@render row("Laatst gezien", new Date(hit.lastScraped).toLocaleDateString("nl-NL", DATE_TIME_FORMATTING))}
		</div>
	</div>
</div>
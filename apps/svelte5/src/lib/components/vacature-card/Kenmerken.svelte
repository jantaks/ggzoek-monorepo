<script lang="ts">
	import type { Hit } from 'meilisearch';
	import type { SelectVacature } from '@ggzoek/ggz-drizzle/dist/schema';

	type Props = {
		hit: Hit<SelectVacature>
	};

	const { hit }: Props = $props();

</script>
{#snippet row(title, value)}
	<div class="grid grid-cols-2 items-center border-b border-b-gray-300 py-1 ">
		<h3 class="truncate">{title}:</h3>
		<p>{value || 'onbekend' }</p>
	</div>
{/snippet}
<div class="p-1  bg-white">
	<div class="grid grid-cols-1 lg:grid-cols-2 items-start cols-auto gap-2 w-full">
		<div class="h-full bg-transparent p-2">
			<h2 class="font-semibold mb-2">Arbeidsvoorwaarden</h2>
			{@render row("CAO", hit.cao)}
			{@render row("Functiegroep", hit.fwg)}
			{@render row("Salaris", hit.salarisMin ? `€${hit.salarisMin} - €${hit.salarisMax}` : undefined)}
		</div>
		<div class="h-full bg-transparent p-2">
			<h2 class="font-semibold mb-2">Inhoudelijk</h2>
			{@render row("Behandelmethoden", hit.behandelmethoden?.join(", "))}
			{@render row("Stoornissen", hit.stoornissen?.join(", "))}
			{@render row("Beroepen", hit.beroepen?.join(", "))}
			{@render row("Eerst gezien", hit.firstScraped)}
			{@render row("Laatst gezien", hit.lastScraped)}
		</div>
	</div>
</div>
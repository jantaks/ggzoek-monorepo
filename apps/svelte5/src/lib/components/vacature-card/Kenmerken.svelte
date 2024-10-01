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
	<div class="grid grid-cols-2 items-center border-b border-b-gray-300 last:border-none py-2">
		<dt class="truncate">{title}:</dt>
		{#if value instanceof Date}
			<dd>
				<time datetime={value.toLocaleDateString()}
							class="text-wrap truncate">{value.toLocaleDateString("nl-NL", DATE_TIME_FORMATTING)}</time>
			</dd>

		{:else}
			<dd class="text-wrap truncate">{value || '-' }</dd>
		{/if}
	</div>
{/snippet}
<div class="bg-transparent">
	<div class="grid grid-cols-1 lg:grid-cols-2 items-start cols-auto gap-6 w-full">
		<div class="h-full bg-transparent mt-2">
			<h2 class="font-semibold py-1">Arbeidsvoorwaarden</h2>
			<dl>
				{@render row("Salaris", hit.salarisMin ? `€${hit.salarisMin} - €${hit.salarisMax}` : undefined)}
				{@render row("Uren", `${hit.urenMin ?? "onbekend"} - ${hit.urenMax ?? "onbekend"}`)}
				{@render row("Contract", hit.contract)}
				{@render row("Werklocatie", hit.werkvorm)}
				{@render row("CAO", hit.cao)}
				{@render row("Functiegroep", hit.fwg)}
			</dl>

		</div>
		<div class="h-full bg-transparent mt-2">
			<h2 class="font-semibold  py-1">Inhoudelijk</h2>
			<dl>
				{@render row("Therapievormen", hit.therapievormen?.join(", "))}
				{@render row("Organisatieonderdeel", hit.organisatieOnderdeel)}
				{@render row("Stoornissen", hit.aandachtsgebieden?.join(", "))}
				{@render row("Beroepen", hit.beroepen?.join(", "))}
				{@render row("Eerst gezien", new Date(hit.firstScraped))}
				{@render row("Laatst gezien", new Date(hit.lastScraped))}
				{@render row("ggzoek kenmerk", hit.urlHash.substring(0, 8))}
			</dl>
		</div>
	</div>
</div>
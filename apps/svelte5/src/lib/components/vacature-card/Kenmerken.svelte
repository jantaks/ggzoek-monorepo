<script lang="ts">
  import type { Hit } from 'meilisearch';
  import type { SelectVacature } from '@ggzoek/ggz-drizzle/drizzle/schema';

  type Props = {
		hit: Hit<SelectVacature>
	};

	const { hit }: Props = $props();

</script>
<div class="py-4 px-4 bg-white">
	<div class="grid grid-cols-2 items-start cols-auto gap-4 w-full">
		<div class="h-full bg-transparent p-2">
			<h2 class="font-semibold mb-2">Arbeidsvoorwaarden</h2>
			<div class="grid grid-cols-2 items-center border-b border-b-gray-300 py-2 ">
				<h3 class="">CAO:</h3>
				<p>{hit.cao || 'onbekend' }</p>
			</div>
			<div class="grid grid-cols-2 items-center border-b border-b-gray-300 py-2 ">
				<h3 class="">Functiegroep:</h3>
				<p>{hit.fwg || 'onbekend' }</p>
			</div>
			<div class="grid grid-cols-2 items-center border-b border-b-gray-300 py-2 ">
				<h3 class="">Salaris:</h3>
				<p>€{hit.salarisMin || '?' } - €{hit.salarisMax || '?'}</p>
			</div>
		</div>
		<div class="h-full bg-transparent p-2">
			<h2 class="font-semibold mb-2">Inhoudelijk</h2>
			<div class="grid grid-cols-2 items-center border-b border-b-gray-300 py-2 ">
				<h3 class="">Behandelmethoden:</h3>
				<p>{hit.behandelmethoden.join(", ") || 'onbekend' }</p>
			</div>
			<div class="grid grid-cols-2 items-center border-b border-b-gray-300 py-2 ">
				<h3 class="">Stoornissen:</h3>
				<p class="line-clamp-5">{hit.stoornissen.join(", ") || 'onbekend' }</p>
			</div>
			<div class="grid grid-cols-2 items-center border-b border-b-gray-300 py-2 ">
				<h3 class="">Beroepen:</h3>
				<p class="line-clamp-5">{hit.beroepen.join(", ") || 'onbekend' }</p>
			</div>
			<div class="grid grid-cols-2 items-center border-b border-b-gray-300 py-2 ">
				<h3 class="">Eerst gezien:</h3>
				<p class="line-clamp-5">{hit.firstScraped || 'onbekend' }</p>
			</div>
			<div class="grid grid-cols-2 items-center border-b border-b-gray-300 py-2 ">
				<h3 class="">Laatst gezien:</h3>
				<p class="line-clamp-5">{hit.lastScraped || 'onbekend' }</p>
			</div>

		</div>
	</div>
</div>
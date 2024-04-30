<script lang="ts">
	import type { Vacature } from '$lib/types';
	import SaveVacatureButton from '$lib/components/SaveVacatureButton.svelte';
	import { Tab, TabGroup } from '@skeletonlabs/skeleton';

	let tabSet: number = 0;
	export let vacature: Vacature;

	$: url = new URL(vacature.url).hostname;

	let rows: { [key: string]: string } = {
		'Instelling': vacature.instelling,
		'Organisatie onderdeel': vacature.organisatieOnderdeel,
		'Locatie(s)': vacature.locaties?.join(', '),
		'Beroepen': vacature.beroepen.join(', '),
		'CAO': vacature.CAO,
		'Contract': vacature.contract,
		'Werkvorm': vacature.werkvorm,
		'Stoornissen': vacature.stoornissen.join(', '),
		'Opleidings budget': `${vacature.opleidingsbudget} ${vacature.opleidingsbudgetSize > 0 ? `(€${vacature.opleidingsbudgetSize},-)` : ''}`
	};

</script>

<div class="card p-4 card-hover max-w-xs sm:max-w-5xl">
	<header class="card-header">
		<h2 class="text-xl md:text-3xl">{@html vacature.title} - {vacature.instelling}</h2>

	</header>
	<section class="p-4">
		<TabGroup>
			<Tab bind:group={tabSet} name="tab2" value={0}><span class="text-sm sm:text-base">Samenvatting</span></Tab>
			<Tab bind:group={tabSet} name="tab3" value={1}><span class="text-sm sm:text-base">Kenmerken</span></Tab>
			<svelte:fragment slot="panel">
				{#if tabSet === 0}
					<p class="text-sm sm:text-base">{@html vacature.summary}</p>
				{:else if tabSet === 1}
					<div class="table-container overflow-x-auto">
						<table class="table table-hover table-compact table-zebra">
							<tbody>
							{#each Object.keys(rows) as key}
								<tr>
									<td class="table-cell-fit font-bold">{key}:</td>
									<td>{rows[key]}</td>
								</tr>
							{/each}
							</tbody>
						</table>
					</div>
				{/if}
			</svelte:fragment>
		</TabGroup>

		<!--		<hr class="mt-4 !border-t-2 " />-->
	</section>
	<footer class="card-footer">
		<div class="flex flex-row space-x-2">
			<SaveVacatureButton vacature={vacature} />
			<a href={vacature.url} target="_blank" class="chip variant-soft hover:variant-filled">
				<span>{url}</span>
				<span class="icon-[mdi--open-in-new] size-6"></span>
			</a>
		</div>
	</footer>
</div>

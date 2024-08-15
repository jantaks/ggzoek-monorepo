<script lang="ts">
	import { Tabs } from 'bits-ui';
	import { type SelectVacature } from '@ggzoek/ggz-drizzle/dist/schema';
	import type { Hit } from 'meilisearch';
	import GotoWebsiteButton from '$lib/components/vacature-card/GotoWebsiteButton.svelte';
	import SaveVacature from '$lib/components/vacature-card/SaveVacature.svelte';
	import Kenmerken from '$lib/components/vacature-card/Kenmerken.svelte';
	import { slide } from 'svelte/transition';
	import { ChevronDown, ChevronUp } from 'lucide-svelte';
	import { createCollapsible, melt } from '@melt-ui/svelte';

	const x = Tabs; //HACK TO AVOID UNUSED IMPORTS.

	type Props = {
		hit: Hit<Partial<SelectVacature>>;
	}
	let { hit }: Props = $props();

	let locaties = $derived(hit.locaties ? hit.locaties.join(', ') : 'Locatie onbekend');

	const {
		elements: { root, content, trigger },
		states: { open }
	} = createCollapsible({
		forceVisible: true
	});


</script>

{#snippet tabTrigger(value, title)}
	<Tabs.Trigger
		value={value}>
		<div class="mr-4">
			<hr class="w-12 mx-auto">
			<div class="py-1  text-center">{title}</div>
		</div>

	</Tabs.Trigger>
{/snippet}

<div class="p-1.5 sm:p-4 sm:rounded-lg bg-white/50 text-slate-700 border shadow">
	<div>
		<div class="flex flex-row justify-between">
			<h2 class="font-bold sm:text-xl mb-1">{@html hit.title}</h2>
			<div class="font-normal flex flex-row space-x-2 px-1">
				<SaveVacature urlhash="{hit.urlHash}" />
				<GotoWebsiteButton url={hit.url} />
			</div>
		</div>

		<h2 class="font-semibold uppercase py-2">{@html hit.organisatie} <span
			class="truncate capitalize font-light ml-1 text-wrap ">{locaties}</span>
		</h2>


	</div>

	<div class="">
		<Tabs.Root>
			<Tabs.List
				class="lg:w-fit flex sm:flex-row">
				{@render tabTrigger("overzicht", "Samenvatting")}
				{@render tabTrigger("kenmerken", "Kenmerken")}
			</Tabs.List>
			<Tabs.Content value="overzicht">
				<div class="py-4 px-0 bg-transparent">
					{#if hit.summary && hit.summary.length > 0}
						{#if !$open}
							<div use:melt={$content} transition:slide>
								<p
									class="line-clamp-4 md:line-clamp-6">{@html hit.summary.replaceAll("\n", "<hr class='border-0 h-1'>")}
								</p>
							</div>
						{:else}
							<div use:melt={$content} transition:slide>
								<p
									class="line-clamp-none">{@html hit.summary.replaceAll("\n", "<hr class='border-0 h-1'>")}
								</p>
							</div>
						{/if}
					{/if}
					<div class="w-full justify-center flex flex-row">
						<button
							class="text-blue-500 hover:text-blue-700 underline"
							use:melt={$trigger}>
							{#if !$open}
								<ChevronDown
									class="size-8  text-primary transform hover:scale-125 transition duration-500 ease-in-out" />
							{:else}
								<ChevronUp class="size-8  text-primary transform hover:scale-125 transition duration-500 ease-in-out" />
							{/if}
						</button>
					</div>
				</div>
			</Tabs.Content>
			<Tabs.Content value="kenmerken">
				<Kenmerken hit={hit}></Kenmerken>
			</Tabs.Content>
		</Tabs.Root>
	</div>
</div>




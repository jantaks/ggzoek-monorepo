<script lang="ts">
	import { Tabs } from 'bits-ui';
	import { type SelectVacature } from '@ggzoek/ggz-drizzle/dist/schema';
	import type { Hit } from 'meilisearch';
	import GotoWebsiteButton from '$lib/components/vacature-card/GotoWebsiteButton.svelte';
	import SaveVacature from '$lib/components/vacature-card/SaveVacature.svelte';
	import Kenmerken from '$lib/components/vacature-card/Kenmerken.svelte';
	import { ChevronDown, ChevronUp } from 'lucide-svelte';
	import { slide, fade, fly, blur } from 'svelte/transition';

	const x = Tabs; //HACK TO AVOID UNUSED IMPORTS.

	type Props = {
		hit: Hit<Partial<SelectVacature>>;
		onSave?: () => void;
	}
	let { hit, onSave }: Props = $props();

	let locaties = $derived(hit.locaties ? hit.locaties.join(', ') : 'Locatie onbekend');

	let collapsed = $state(true);


</script>

{#snippet tabTrigger(value, title)}
	<Tabs.Trigger class="mb-2"
								value={value}>
		<div class="mr-4">
			<p class="text-center font-medium mb-1">{title}</p>
			<hr class="w-20 mx-auto">
		</div>
	</Tabs.Trigger>
{/snippet}

<article class="mx-1.5 md:mx-0 p-2 sm:p-4 rounded-lg  bg-white md:bg-white/50 text-slate-700 border shadow">
	<div>
		<div class="flex flex-row justify-between">
			<h2 class="font-bold sm:text-xl mb-1 text-wrap truncate">{@html hit.title}</h2>
			<menu class="font-normal flex flex-row space-x-2 px-1">
				<SaveVacature onSave={onSave} urlhash="{hit.urlHash}" />
				<GotoWebsiteButton url={hit.url} />
			</menu>
		</div>
		<h3 class="text-sm sm:text-md font-semibold uppercase py-2">{@html hit.organisatie} <span
			class="truncate capitalize font-light ml-1 text-wrap ">{locaties}</span>
		</h3>
	</div>

	<div class="">
		<Tabs.Root class="mt-4 text-sm md:text-base">
			<Tabs.List
				class="lg:w-fit flex sm:flex-row">
				{@render tabTrigger("overzicht", "Samenvatting")}
				{@render tabTrigger("kenmerken", "Kenmerken")}
			</Tabs.List>
			<Tabs.Content value="overzicht">
				<div class="bg-transparent">
					{#if hit.summary && hit.summary.length > 0}
						<div>
							{#if collapsed}
								<p class="line-clamp-4">
									{@html hit.summary}</p>
							{:else}
								<!--// line-clamp in older safari does not work with nested elements ... -->
								<p class="line-clamp-none">
									{@html hit.summary.replaceAll("\n", "<hr class='border-0 h-2'>")}
								</p>
							{/if}
						</div>
					{/if}
					<div class="w-full justify-center flex flex-row">
						<button
							class="text-blue-500 hover:text-blue-700 underline"
						>
							{#if collapsed}
								<ChevronDown
									class="size-8 text-primary transform hover:scale-125 transition duration-500 ease-in-out"
									onclick={() => collapsed = !collapsed} />
							{:else}
								<ChevronUp
									class="size-8 text-primary transform hover:scale-125 transition duration-500 ease-in-out"
									onclick={() => collapsed = !collapsed} />
							{/if}
						</button>
					</div>
				</div>
			</Tabs.Content>
			<Tabs.Content value="kenmerken">
				<Kenmerken class="bg-transparent" hit={hit}></Kenmerken>
			</Tabs.Content>
		</Tabs.Root>
	</div>
</article>




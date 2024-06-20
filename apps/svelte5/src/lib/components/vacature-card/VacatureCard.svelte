<script lang="ts">
  import { Tabs } from 'bits-ui';
  import { type SelectVacature } from '@ggzoek/ggz-drizzle/drizzle/schema';
  import type { Hit } from 'meilisearch';
  import GotoWebsiteButton from '$lib/components/vacature-card/GotoWebsiteButton.svelte';
  import SaveVacature from '$lib/components/vacature-card/SaveVacature.svelte';
  import Kenmerken from '$lib/components/vacature-card/Kenmerken.svelte';
  import { crossfade } from 'svelte/transition';
  import { cubicInOut } from 'svelte/easing';

  const x = Tabs; //HACK TO AVOID UNUSED IMPORTS.

  type Props = {
    hit: Hit<Partial<SelectVacature>>;
  }
  let { hit }: Props = $props();

  const [send, receive] = crossfade({
    duration: 250,
    easing: cubicInOut
  });


</script>

<div class="p-4 rounded-lg bg-white text-slate-700 border shadow ">
  <div class="flex flex-row justify-between space-x-2 items-center border-b pb-2 border-b-pink-200" id="header">
    <div>
      <h2 class="font-bold text-xl min-w-fit mb-1">{@html hit.title}</h2>
      <h2 class="font-semibold uppercase mr-1 truncate">{@html hit.organisatie} <span
        class="truncate capitalize font-light ml-1">{hit.locaties.join(', ')}</span>
      </h2>
    </div>

    <div class="font-normal justify-end flex flex-row space-x-2">

      <SaveVacature urlhash="{hit.urlHash}" />
      <GotoWebsiteButton url={hit.url} />
    </div>

  </div>

  <div class="py-4">
    <Tabs.Root>
      <Tabs.List
        class="lg:w-fit flex flex-row">
        <Tabs.Trigger
          value="overzicht">
          <div class="py-0.5 px-4">samenvatting
          </div>
        </Tabs.Trigger>
        <Tabs.Trigger
          value="kenmerken">
          <div class="py-0.5 px-4">kenmerken</div>
        </Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="overzicht">
        <div class="py-4 px-4 bg-white">
          {#if hit.summary && hit.summary.length > 0}
            <p>{@html hit.summary.replaceAll("\n", "<hr class='border-0 h-1'>")}</p>
          {/if}
        </div>
      </Tabs.Content>
      <Tabs.Content value="kenmerken">
        <Kenmerken hit={hit}></Kenmerken>
      </Tabs.Content>
    </Tabs.Root>
  </div>
</div>


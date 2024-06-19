<script lang="ts">
  import { Tabs } from 'bits-ui';
  import { type SelectVacature } from '@ggzoek/ggz-drizzle/drizzle/schema';
  import type { Hit } from 'meilisearch';
  import Location from '$lib/components/icons/Location.svelte';
  import Business from '$lib/components/icons/Business.svelte';

  const x = Tabs; //HACK TO AVOID UNUSED IMPORTS.

  type Props = {
    hit: Hit<Partial<SelectVacature>>;
  }
  let { hit }: Props = $props();

  let locatie = hit.locaties.join(', ');


</script>

<div class="p-4 my-4 rounded bg-pink-50 text-slate-700">
  <div class="bg-pink-50 flex flex-row justify-between">
    <h2 class="font-bold uppercase text-pink-500 min-w-fit">{@html hit.title}</h2>
    <div class="flex flex-row gap-4 align-top">
      <div class="flex flex-row items-center">
        <Business class=" size-5 mr-1" />
        <h2 class="font-bold ">{@html hit.organisatie}</h2>
      </div>
      <div class="flex flex-row items-center">
        <Location class=" size-5 mr-1" />
        <h2 class="font-bold ">{locatie}</h2>
      </div>
    </div>

  </div>
  <div class="py-4">
    <Tabs.Root>
      <Tabs.List
        class="lg:w-fit flex flex-row">
        <Tabs.Trigger
          value="overzicht">
          <div class="py-0.5 px-4">overzicht</div>
        </Tabs.Trigger>
        <Tabs.Trigger
          value="kenmerken">
          <div class="py-0.5 px-4">kenmerken</div>
        </Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="overzicht">
        <div class="py-4 px-4 bg-white shadow">
          <p>{@html hit.summary}</p>
        </div>

      </Tabs.Content>
      <Tabs.Content value="kenmerken">
        <div class="py-4 px-4 bg-white shadow">
          <p>{@html hit.locaties}</p>
        </div>
      </Tabs.Content>
    </Tabs.Root>
  </div>


</div>
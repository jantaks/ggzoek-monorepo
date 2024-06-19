<script lang="ts">
  import { Tabs } from 'bits-ui';
  import { type SelectVacature } from '@ggzoek/ggz-drizzle/drizzle/schema';
  import type { Hit } from 'meilisearch';

  const x = Tabs; //HACK TO AVOID UNUSED IMPORTS.

  type Props = {
    hit: Hit<Partial<SelectVacature>>;
  }
  let { hit }: Props = $props();


</script>


<div class="p-4 m-4 border-2">
  <Tabs.Root>
    <Tabs.List
      class="lg:w-fit flex flex-row gap-4  p-2">
      <Tabs.Trigger
        class="tab"
        value="overzicht">overzicht
      </Tabs.Trigger>
      <Tabs.Trigger
        class="tab"
        value="kenmerken">kenmerken
      </Tabs.Trigger>
    </Tabs.List>
    <Tabs.Content value="overzicht">
      <h2>Title: {@html hit.title}</h2>
      <p>{@html hit.summary}</p>
    </Tabs.Content>
    <Tabs.Content value="kenmerken">
      Inhoud 2
    </Tabs.Content>
  </Tabs.Root>

</div>
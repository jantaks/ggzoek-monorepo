<script lang="ts">
  import { Button } from '$lib/components/ui/button/index.js';
  import { Bell } from 'lucide-svelte';

  function saveSearch() {
    console.log(`Saving search`);
  }

</script>
<Button
  class='px-2 h-8 border-pink-200 border shadow flex flex-row items-center justify-between font-bold bg-transparent text-slate-900 bg-white hover:border-pink-500 hover:bg-white '
  onclick={() => saveSearch()}>
  <Bell class="size-5  text-pink-500 mr-1" />
  <span class="text-xs">Bewaar zoekopdracht</span>
</Button>
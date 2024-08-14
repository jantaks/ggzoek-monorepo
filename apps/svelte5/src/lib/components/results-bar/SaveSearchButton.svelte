<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import { Bell } from 'lucide-svelte';

	function saveSearch() {
		console.log(`Saving search`);
	}

</script>
<Button
	class='px-2 h-8 border-primary-light border shadow flex flex-row items-center justify-between font-bold bg-transparent text-slate-900 bg-white hover:border-primary hover:bg-white '
	onclick={() => saveSearch()}>
	<Bell class="size-5  text-primary mr-1" />
	<span class="text-xs">Bewaar zoekopdracht</span>
</Button>
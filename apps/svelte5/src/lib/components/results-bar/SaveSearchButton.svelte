<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import { Bell } from 'lucide-svelte';
	import { page } from '$app/stores';

	const params = $page.url.searchParams;

	function save() {
		console.debug(`${new Date().toLocaleTimeString()} [SaveSearchButton.svelte - 327c423e] : search: `, params.toString());
	}





</script>
<Button
	class='px-2 h-8 border-primary-light border shadow flex flex-row items-center justify-between font-bold bg-transparent text-slate-900 bg-white hover:border-primary hover:bg-white '
	onclick={() => save()}>
	<Bell class="size-5  text-primary mr-1" />
	<span class="text-xs">Bewaar zoekopdracht</span>
</Button>
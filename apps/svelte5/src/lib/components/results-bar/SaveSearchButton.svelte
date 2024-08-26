<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import { Bell } from 'lucide-svelte';
	import { page } from '$app/stores';
	import { enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { getUser } from '$lib/stores/userStore.svelte';

	const params = $page.url.searchParams;
	const userStore = getUser()
	let processing = $state(false);
	let saved = $state(false)

	const enh: SubmitFunction = async (input) => {
		if (processing) {
			console.log('cancelling submit')
			input.cancel();
			return
		}
		processing = true;
		return async ({ result, update }) => {
			console.log('result', result);
			await update()
			processing = false;
		};
		
	};

	$effect(() => {
		if (userStore.savedSearches) {
			saved = userStore.savedSearches.includes(params.toString());
		}
		console.log('saved', saved)
	});


</script>
{#if saved}
	<form action="zoekresultaten?/deleteSearch" method="POST" use:enhance={enh}>
		<input name="searchParams" type="hidden" value={params.toString()} />
	<Button
		class='px-2 h-8 border-primary-light border shadow flex flex-row items-center justify-between font-bold bg-transparent text-slate-900 bg-white hover:border-primary hover:bg-white '
		type="submit"
	>
		<Bell class={`text-primary size-5 mr-1 ${saved? "fill-primary" : "" } ${processing? "text-primary-light animate-spin" : "" }`} />
		<span class="text-xs">Verwijder zoekopdracht</span>
	</Button>
	</form>
	{:else}
<form action="zoekresultaten?/saveSearch" method="POST" use:enhance={enh}>
	<input name="searchParams" type="hidden" value={params.toString()} />
<Button
	class='px-2 h-8 border-primary-light border shadow flex flex-row items-center justify-between font-bold bg-transparent text-slate-900 bg-white hover:border-primary hover:bg-white '
	type="submit"
>
	<Bell class={`text-primary size-5 mr-1 ${saved? "fill-primary" : "" } ${processing? "text-primary animate-spin" : "" }`} />
	<span class="text-xs">Bewaar zoekopdracht</span>
</Button>
</form>
	{/if}
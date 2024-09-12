<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import { Bell } from 'lucide-svelte';
	import { page } from '$app/stores';
	import { applyAction, enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { goto, invalidate } from '$app/navigation';
	import Button2 from '$lib/components/ui/button/Button2.svelte';
	import Button3 from '$lib/components/ui/button/Button3.svelte';

	const params = $page.url.searchParams;
	let processing = $state(false);

	let saved = $state($page.data.savedSearches?.some((ss: any) => ss.searchUrlParams === params.toString()));


	const enh: SubmitFunction = async (input) => {
		processing = true;
		return async ({ result }) => {
			if (result.type === 'redirect') {
				await goto(result.location);
			}
			console.log('result', result);
			await applyAction(result);
			await invalidate('data:root');
			saved = !saved;
			processing = false;
		};

	};

</script>
<form action={saved? "zoekresultaten?/deleteSearch" : "zoekresultaten?/saveSearch"} method="POST" use:enhance={enh}>
	<input name="searchParams" type="hidden" value={params.toString()} />
	<Button3
		disabled={processing}
		type="submit"
	>
		<Bell
			class={`text-secondary size-5 mr-1 ${saved? "fill-secondary" : "" } ${processing? "text-secondary-light fill-secondary animate-spin" : "" }`} />
		<span class="text-xs">{saved ? "Verwijder zoekopdracht" : "Bewaar zoekopdracht" }</span>
	</Button3>
</form>

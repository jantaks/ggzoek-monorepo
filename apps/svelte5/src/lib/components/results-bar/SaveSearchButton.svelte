<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import { Bell } from 'lucide-svelte';
	import { page } from '$app/stores';
	import { applyAction, enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { goto, invalidate } from '$app/navigation';

	const params = $page.url.searchParams;
	let processing = $state(false);
	$inspect($page.data.savedSearches);
	$inspect(params.toString());

	let saved = $state($page.data.savedSearches?.includes(params.toString()));
	$inspect(saved).with((type, value) => {
		console.log("SAVED", type, value);
	});

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
		<Button
			class='px-2 h-8 border-primary-light border shadow flex flex-row items-center justify-between font-bold bg-transparent text-slate-900 bg-white hover:border-primary hover:bg-white '
			disabled={processing}
			type="submit"
		>
			<Bell
				class={`text-primary size-5 mr-1 ${saved? "fill-primary" : "" } ${processing? "text-primary-light fill-primary animate-spin" : "" }`} />
			<span class="text-xs">{saved? "Verwijder zoekopdracht" : "Bewaar zoekopdracht" }</span>
		</Button>
	</form>

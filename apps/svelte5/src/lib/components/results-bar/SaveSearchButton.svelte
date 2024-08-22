<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import { Bell } from 'lucide-svelte';
	import { page } from '$app/stores';
	import { enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';

	const params = $page.url.searchParams;

	async function save() {
		console.debug(`${new Date().toLocaleTimeString()} [SaveSearchButton.svelte - 327c423e] : search: `, params.toString());
	}

	const enh: SubmitFunction = async (input) => {
		return async ({ result, update }) => {
			console.log('result', result);
			await update()
		};
		
	};


</script>
<form action="zoekresultaten?/saveSearch" method="POST" use:enhance={enh}>
	<input name="searchParams" type="hidden" value={params.toString()} />
<Button
	class='px-2 h-8 border-primary-light border shadow flex flex-row items-center justify-between font-bold bg-transparent text-slate-900 bg-white hover:border-primary hover:bg-white '
	type="submit"
>
	<Bell class="size-5  text-primary mr-1" />
	<span class="text-xs">Bewaar zoekopdracht</span>
</Button>
</form>
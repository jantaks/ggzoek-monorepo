<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import { Heart } from 'lucide-svelte';
	import { page } from '$app/stores';
	import { applyAction, enhance } from '$app/forms';
	import { goto, invalidate } from '$app/navigation';


	type Props = {
		urlhash?: string;
		onSave?: () => void;
	}
	const { urlhash, onSave }: Props = $props();
	let liked = $state($page.data.likes?.includes(urlhash));

	let updatePending = $state(false);

</script>
<form action={liked? "zoekresultaten?/deleteVacature": "zoekresultaten?/saveVacature"}
			method="POST"
			use:enhance={() => {
				updatePending = true;
					return async ({result}) => {
						if (result.type	 === "redirect"){
							goto(result.location);
							}
						if (result.type === "success"){
							updatePending = false;
							liked = !liked;
							if (onSave){
								onSave();
							}
							await applyAction(result);
							await invalidate('data:root');
						}
					};
				}}>
	<input name="urlHash" type="hidden" value={urlhash} />
	<Button
		class="px-2 h-8 border-primary-light border shadow flex flex-row items-center justify-between font-bold bg-transparent text-slate-900 bg-white hover:border-primary hover:bg-white "
		disabled={updatePending}
		title={urlhash}
		type="submit">
		<Heart
			class={`text-primary size-5 mr-1 ${liked? "fill-primary" : "" } ${updatePending? "fill-primary text-primary-light animate-spin" : "" }`}></Heart>
		<p class="hidden md:flex text-xs text-slate-900">{liked ? "Bewaard" : "Bewaar"}</p>
	</Button>
</form>



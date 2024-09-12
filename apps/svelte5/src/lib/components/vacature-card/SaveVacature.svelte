<script lang="ts">

	import { Heart } from 'lucide-svelte';
	import { page } from '$app/stores';
	import { applyAction, enhance } from '$app/forms';
	import { goto, invalidate } from '$app/navigation';
	import Button2 from '$lib/components/ui/button/Button2.svelte';
	import Button3 from '$lib/components/ui/button/Button3.svelte';


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
	<Button3
		icon={Heart}
		iconClass={`size-5 mr-1 ${liked? "fill-secondary text-secondary-900 " : "" } ${updatePending? "fill-secondary text-secondary-light animate-spin " : "" }`}
		title={urlhash}
		type="submit"
		updatePending={updatePending}
		variant="primary">
		<p class="hidden md:flex text-xs">{liked ? "Bewaard" : "Bewaar"}</p>
	</Button3>
</form>



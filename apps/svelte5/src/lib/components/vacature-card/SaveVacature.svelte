<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import { Heart } from 'lucide-svelte';
	import { getUser } from '$lib/stores/userStore.svelte';
	import { goto } from '$app/navigation';

	const user = getUser();

	type Props = {
		urlhash?: string;
	}
	const { urlhash }: Props = $props();

	let liked = $derived.by(() => {
		if (user && user.likes && urlhash) {
			return user.likes.includes(urlhash);
		}
		return false;
	});

	let updatePending = $state(false);
	
	async function handleClick() {
		if (!user) {
			console.log('user not logged in');
			await goto('/auth/login');
			return;
		}
		updatePending = true;
		await user.toggleLike(urlhash);
		updatePending = false;

	}

</script>

<Button
	class="px-2 h-8 border-pink-200 border shadow flex flex-row items-center justify-between font-bold bg-transparent text-slate-900 bg-white hover:border-pink-500 hover:bg-white "
	onclick={handleClick}>
	<Heart
		class={`text-pink-600 size-5 mr-1 ${liked? "fill-pink-600" : "" } ${updatePending? "fill-pink-200 text-pink-200" : "" }`}></Heart>
	<p class="text-xs text-slate-900">{liked ? "Bewaard" : "Bewaar"}</p>
</Button>



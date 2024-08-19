<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import { Heart } from 'lucide-svelte';
	import { getUser } from '$lib/stores/userStore.svelte';
	import { goto } from '$app/navigation';
	import { getContext } from 'svelte';


	const user = getUser();
	const onRemove = getContext<(urlHash: string) => void>('onRemove');

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
		if (liked && onRemove) {
			onRemove(urlhash);
		}
		updatePending = true;
		await user.toggleLike(urlhash);
		updatePending = false;

	}

</script>

<Button
	class="px-2 h-8 border-primary-light border shadow flex flex-row items-center justify-between font-bold bg-transparent text-slate-900 bg-white hover:border-primary hover:bg-white "
	onclick={handleClick}>
	<Heart
		class={`text-primary size-5 mr-1 ${liked? "fill-primary" : "" } ${updatePending? "fill-primary-light text-primary-light" : "" }`}></Heart>
	<p class="hidden md:flex text-xs text-slate-900">{liked ? "Bewaard" : "Bewaar"}</p>
</Button>



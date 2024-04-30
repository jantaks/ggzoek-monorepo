<script lang="ts">
	import { page } from '$app/stores';
	import { likesCounter } from '$lib/stores.js';
	import type { Vacature } from '$lib/types';
	import { enhance } from '$app/forms';
	import { makeEnhanced, status, Status } from '$lib/helpers';
	import { getToastStore } from '@skeletonlabs/skeleton';

	const toastStore = getToastStore();


	export let vacature: Vacature;

	$: liked = $page.data?.likes?.includes(vacature.urlHash);
	$: loading = false;

	$: enhanceFn = async ({ formData }) => {
		makeEnhanced(formData);

		loading = true;

		return async ({ result, update }) => {
			console.log(result.status);
			if (status(result) === Status.REDIRECT) {
				//redirect for some reason (probably not logged in)
				update();
			} else if (status(result) === Status.SUCCESS) {
				loading = false;
				if (liked) {
					likesCounter.decrement();
					toastStore.trigger({ message: 'Vacature verwijderd uit favorieten.', timeout: 1000 });
				} else {
					likesCounter.increment();
					toastStore.trigger({ message: 'Vacature toegevoegd aan favorieten.', timeout: 1000 });
				}
				liked = !liked;
				console.log('Aantal likes: ', $likesCounter);
			}
			//something went wrong
			loading = false;
		};
	};
	const route = '/likes?/toggleLike';
</script>
<div class="tooltip" data-tip="Bewaar vacature">
	<form action={route} method="POST" use:enhance={enhanceFn}>
		<input type="hidden" name="urlHash" value={vacature.urlHash} />
		<input type="hidden" name="next" value="{$page.url}" />
		<input type="hidden" name="liked" value={liked} />
		{#if loading}
			<button class="chip variant-soft hover:variant-filled">
				<span>bewaar</span>
				<span class="icon-[mdi--loading] size-6 animate-spin"></span>
			</button>
		{/if}
		{#if liked && !loading}
			<button type="submit" class="chip variant-soft hover:variant-filled">
				<span>verwijder</span>
				<span class="icon-[mdi--heart] size-6"></span>
			</button>
		{:else if !liked && !loading}
			<button type="submit" class="chip variant-soft hover:variant-filled">
				<span>bewaar</span>
				<span class="icon-[mdi--heart-outline] size-6"></span>
			</button>
		{/if}
	</form>
</div>
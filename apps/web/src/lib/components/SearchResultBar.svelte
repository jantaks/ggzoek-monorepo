<script lang="ts">
	import { page } from '$app/stores';
	import { alerts } from '$lib/stores';
	import { enhance } from '$app/forms';
	import { makeEnhanced } from '$lib/helpers';

	export let hitcount: number;
	const action = '/likes?/saveSearch';

	const enhanceFn = ({ formData }) => {
		makeEnhanced(formData);

		return async ({ result, update }) => {
			$alerts = 'Uw Zoekopdracht is bewaard';
			console.log($alerts);
		};
	};
</script>

<div
	class="hidden lg:flex flex-row items-center justify-between rounded-xl py-2">
	<form action={action} method="POST" use:enhance={enhanceFn} class="flex">
		<input type="hidden" name="next" value="{$page.url}" />
		<button type="submit" class="btn variant-filled-primary">
			<span class="icon-[mdi--add-alert] size-6 text-white flex"></span>
			<span>Bewaar zoekopdracht</span>
		</button>

	</form>
	<span class="badge variant-filled">{hitcount} resultaten</span>

</div>
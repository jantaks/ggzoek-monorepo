<script lang="ts">
	import '../app.css';
	import { createSearchForm } from '$lib/stores/formStore.svelte';
	import { createUser } from '$lib/stores/userStore.svelte';
	import { page } from '$app/stores';


	console.log('Initialising index,layout. Creating userStore');
	const userStore = createUser($page.data.email, $page.data.likes);

	$effect(() => {
		// We run this effect to update the userStore when the page data changes. This way we can keep the userStore in sync with the page data without redirecting.
		userStore.email = $page.data.email;
		userStore.likes = $page.data.likes;
	});

	createSearchForm();
</script>
<slot></slot>
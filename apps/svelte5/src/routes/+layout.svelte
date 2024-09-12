<script lang="ts">
	import '../app.css';
	import { createSearchForm } from '$lib/stores/formStore.svelte';
	import { createUser } from '$lib/stores/userStore.svelte';
	import { page } from '$app/stores';
	import NavBar from '$lib/components/navbar/NavBar.svelte';
	import { onNavigate } from '$app/navigation';


	console.log('Initialising index,layout. Creating userStore');
	const userStore = createUser($page.data.email, $page.data.likes, $page.data.savedSearches);

	$effect(() => {
		// We run this effect to update the userStore when the page data changes. This way we can keep the userStore in sync with the page data without redirecting.
		userStore.email = $page.data.email;
		userStore.likes = $page.data.likes;
		userStore.savedSearches = $page.data.savedSearches;
	});

	createSearchForm();

	onNavigate((navigation) => {
		if (!document.startViewTransition) return;
		console.log('startViewTransition');

		return new Promise((resolve) => {
			document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
		});
	});

</script>

<svelte:head>
	<link href="https://fonts.googleapis.com" rel="preconnect">
	<link crossorigin href="https://fonts.gstatic.com" rel="preconnect">
	<link
		href="https://fonts.googleapis.com/css2?family=Reddit+Sans+Condensed:wght@200..900&family=Roboto+Slab:wght@100..900&display=swap"
		rel="stylesheet">

	<style>
      body {
          @apply bg-grijs;
          @apply font-sans;
      }
	</style>
</svelte:head>
<div class="flex flex-col min-h-screen">
	<NavBar class="bg-secondary-900 text-primary-200" showLinks showLogin></NavBar>
	<slot></slot>
</div>


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
	<style>
      body {
          @apply bg-secondary-100 md:bg-gradient-to-r from-secondary-300 via-primary-light to-white;
      }
	</style>
</svelte:head>
<NavBar class="bg-secondary-900 text-white" showLinks showLogin></NavBar>
<slot></slot>

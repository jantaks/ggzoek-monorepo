<script lang="ts">
	import type { LayoutData } from './$types';
	import NavBar from '$lib/components/navbar/NavBar.svelte';

	export let data: LayoutData;
</script>
<svelte:head>
	<style>
      body {
          @apply bg-secondary-900 md:bg-gradient-to-r from-secondary-900 via-primary-light via-75% to-white;
      }
	</style>
</svelte:head>
<NavBar class="bg-secondary-900 text-white" showLinks={true} showLogin={false} />
<div class="flex flex-col items-center justify-center grow h-screen">
	<div class="max-w-lg w-full p-10 space-y-4 bg-white rounded-lg shadow-md shadow-primary-light">
		<slot></slot>
	</div>
</div>



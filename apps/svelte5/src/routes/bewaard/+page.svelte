<script>
	import NavBar from '$lib/components/navbar/NavBar.svelte';
</script>

<svelte:head>
	<style>
      body {
          @apply bg-secondary-100 md:bg-gradient-to-r from-secondary-300 via-primary-light to-white;
      }
	</style>
</svelte:head>

<NavBar class="md:mb-4 bg-secondary-900 text-white" showLinks showLogin></NavBar>
<script lang="ts">
	import { page } from '$app/stores';
	import NavBar from '$lib/components/navbar/NavBar.svelte';
</script>

<svelte:head>
	<style>
      body {
          @apply bg-secondary-900
      }
	</style>
</svelte:head>
<NavBar class="bg-secondary-900 text-white" />
<div class="flex flex-col items-center justify-center h-[90dvh] px-4">
	<div class="max-w-lg w-full p-10 space-y-4 bg-white rounded-lg shadow-md shadow-primary-light text-center">
		<h1 class="text-3xl">Oeps, er is iets misgegaan ...</h1>
		<h1 class="text-lg">{$page.error?.message}</h1>
		<div class="pt-10">
			<a class="text-base bg-primary p-2 rounded-lg text-white hover:bg-primary-light hover:text-slate-800"
				 href="/zoekresultaten">Naar
				zoekpagina</a>
		</div>
	</div>

</div>
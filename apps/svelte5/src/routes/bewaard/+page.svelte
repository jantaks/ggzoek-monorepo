<script lang="ts">
	import NavBar from '$lib/components/navbar/NavBar.svelte';
	import VacatureCard from '$lib/components/vacature-card/VacatureCard.svelte';
	import { getUser } from '$lib/stores/userStore.svelte';

	let { data } = $props();
	let user = getUser();

	let savedVacatures = $derived(data.vacatures.filter(v => user?.likes?.includes((v.vacature.id))));

</script>

<svelte:head>
	<style>
      body {
          @apply bg-secondary-100 md:bg-gradient-to-r from-secondary-300 via-primary-light to-white;
      }
	</style>
</svelte:head>

<NavBar class="md:mb-4 bg-secondary-900 text-white" showLinks showLogin></NavBar>
<div>
	{#if !data.vacatures}
		<p>Geen vacatures gevonden</p>
	{:else}
		{#each data.vacatures as vacature}
			<VacatureCard hit={vacature.vacature}></VacatureCard>
		{/each}
	{/if}
</div>

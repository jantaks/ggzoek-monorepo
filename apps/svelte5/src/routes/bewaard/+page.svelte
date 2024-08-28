<script lang="ts">
	import VacatureCard from '$lib/components/vacature-card/VacatureCard.svelte';
	import { slide } from 'svelte/transition';
	import { invalidateAll } from '$app/navigation';

	let { data } = $props();

	function onSave(){
		invalidateAll()
	}

</script>

<div class="pt-4 flex flex-col justify-center items-center w-full space-y-4">
	<h1 class="text-xl font-bold">U heeft {data.vacatures.length} bewaarde vacatures.</h1>
	{#each data.vacatures as vacature (vacature.vacature.urlHash)}
			<div out:slide={{axis:"y", duration:300}} in:slide={{axis:"y", duration:500}} class="max-w-3xl">
				<VacatureCard onSave={()=> onSave()} hit={vacature.vacature}></VacatureCard>
			</div>
	{/each}
</div>

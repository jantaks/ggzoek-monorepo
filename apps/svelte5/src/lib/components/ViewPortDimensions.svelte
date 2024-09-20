<script lang="ts">


	let innerWidth = $state(0);
	let innerHeight = $state(0);


</script>
<svelte:window bind:innerHeight bind:innerWidth />
<div class="p-2 z-[1000] fixed top-2 right-2 bg-yellow-300">
	<p class="text-red-500">{`w: ${innerWidth} h: ${innerHeight}`}</p>
</div>

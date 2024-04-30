<script lang="ts">
	export let title: string;
	export let value: string
</script>
<div class="grid grid-cols-6">
	<h2 class="font-semibold">{title}:</h2>
	<p class="col-span-5">{value}</p>
</div>
<hr class="my-2 bg-gray-300 border border-1">
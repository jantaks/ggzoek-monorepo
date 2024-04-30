<script>
	import { AccordionItem } from '@skeletonlabs/skeleton';

	export let filters;
	export let category;

	let timeout;

	async function submit(event) {
		console.log('CLICKED');
		clearTimeout(timeout);
		timeout = setTimeout(() => {
			event.target.form.requestSubmit();
		}, 200);
	}
</script>
<AccordionItem>
	<svelte:fragment slot="summary">
		<h2 class="capitalize font-bold">{category}</h2>
	</svelte:fragment>
	<svelte:fragment slot="content">
		{#each Object.keys(filters) as key (key)}
			<label class="flex items-center justify-between space-x-2">
				<p>{key} ({filters[key]})</p>
				<input class="checkbox" type="checkbox" name={category} value={key} on:change={submit} />
			</label>
		{/each}
	</svelte:fragment>
</AccordionItem>


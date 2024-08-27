<script lang="ts">


	let { data } = $props();

</script>

{#snippet renderFilter(filter)}

	{#each filter.values as value, index}
		{@render label(value, "bg-primary")}
		{#if index < filter.values.length - 1 }
			{@render label(filter.predicate === "OR" ? "OF " : "EN ", 'bg-secondary-800')}
		{/if}
	{/each}

{/snippet}

{#snippet label(text, bgClass)}
	<div class={"flex flex-col justify-center rounded-md px-1 py-0.5  text-white bg-primary max-w-fit min-h-fit " + bgClass}>
		<div class="uppercase text-xs">{text}</div>
	</div>
{/snippet}


{#each data.savedSearches as search}
	<div class="p-4 shadow drop-shadow-lg max-w-fit bg-blue-300">
		<div class="mb-2 space-y-2 bg-green-400">
			<div class="flex flex-col sm:flex-row sm:items-center space-x-1 space-y-1">
				<div class="capitalize text-sm">Zoektermen:</div>
				{@render label(search.query, "bg-primary")}
			</div>
			{#each search.filters as filter}
				<div class="flex flex-col sm:flex-row sm:items-center space-x-1 space-y-1">
					<div class="capitalize text-sm">{filter.attribute}:</div>
					{@render renderFilter(filter)}
				</div>
			{/each}
		</div>
	</div>
{/each}








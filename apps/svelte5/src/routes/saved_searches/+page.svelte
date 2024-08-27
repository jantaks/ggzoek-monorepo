<script lang="ts">


	let { data } = $props();

</script>

{#snippet renderFilter(filter)}
	{#each filter.values as value, index}
		{@render label(value, "")}
		{#if index < filter.values.length - 1 }
			{@render label(filter.predicate === "OR" ? "OF " : "EN ", 'italic lowercase')}
		{/if}
	{/each}

{/snippet}

{#snippet label(text, txtClass)}
		<div class={"uppercase text-xs " + txtClass}>{text}</div>
{/snippet}


{#each data.savedSearches as search}
	<div class="mb-4 p-2 sm:p-4 rounded-lg bg-white md:bg-white/50 text-slate-700 border shadow">
		<div class="space-y-2">
			<div class="flex flex-col sm:flex-row sm:items-center space-x-1 space-y-1">
				<div class="capitalize text-sm">Zoektermen:</div>
				{@render label(search.query, "")}
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








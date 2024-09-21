<script lang="ts">

	type Props = {
		totalHits?: number;
		href: string;
		isLoading: boolean
		twBgColor?: string
		twTextColor?: string
	}

	let { totalHits, href, isLoading, twBgColor = 'bg-secondary-900', twTextColor = 'text-primary-200' }: Props = $props();

</script>

<div>
	{#if totalHits && totalHits > 0}
		{#key totalHits}
			<a href={`/zoekresultaten?${href}`}>
				<div class="flex justify-center w-full">
					<p
						class={`rounded text-primary-200 text-center font-semibold p-3 w-full ${twBgColor} scale ${twTextColor}`}>
						{isLoading ? 'ggzoeken ...' : totalHits > 1000 ? `Zoek in ${totalHits} vacatures` : `Toon ${totalHits} vacatures.`}
					</p>
				</div>
			</a>
		{/key}
	{:else}
		{#key totalHits}
			<div class="flex justify-center w-full">
				<div class="rounded text-primary-200 text-center font-semibold p-3 w-full bg-gray-400 scale">
					<p>
						Geen resultaten.
					</p>
				</div>
			</div>
		{/key}
	{/if}
</div>


<style>

    .scale {
        animation: scale 0.7s ease-in-out;
    }

    @keyframes scale {
        0% {
            transform: scale(0.9);
            opacity: 0.7;
        }
        100% {
            transform: scale(1);
        }
    }

</style>
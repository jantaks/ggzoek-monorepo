<script lang="ts">
  import SaveSearchButton from '$lib/components/results-bar/SaveSearchButton.svelte';

  type Props = {
    count?: number;
    loading: boolean;
  }

  let { count, loading }: Props = $props();
</script>

<p class="flex flex-wrap gap-2 w-full justify-items-start h-fit min-h-12 text-2xl">
  {#if loading}
    <span class="font-bold">GGZoeken...</span>
  {:else}
    <span class="font-bold">{count} Resultaten</span> voor uw zoekopdracht
    <SaveSearchButton />
  {/if}
</p>
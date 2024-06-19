<script lang="ts">
  type Props = {
    count?: number;
  }

  let { count }: Props = $props();
</script>

<p class="flex flex-wrap gap-2 w-full justify-items-start h-fit min-h-12 text-2xl">
  <span class="font-bold">{count} Resultaten</span> voor uw zoekopdracht
</p>
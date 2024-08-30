<script lang="ts">
	import type { LayoutData } from './$types';

	export let data: LayoutData;
</script>
<svelte:head>
	<style>
      body {
          @apply bg-secondary-900 md:bg-gradient-to-r from-secondary-900 via-primary-light via-75% to-white;
      }
	</style>
</svelte:head>
<div class="flex flex-col items-center justify-center h-[90dvh] px-4">
	<div class="max-w-lg w-full px-8 py-8 bg-white rounded-lg shadow-md shadow-primary-light">
		<slot></slot>
	</div>
</div>




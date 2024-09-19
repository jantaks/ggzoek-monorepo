<script lang="ts">
	import { derived, writable } from 'svelte/store';

	export const viewportDimensions = writable({ width: 0, height: 0 });

	export const viewportWidth = derived(viewportDimensions, $viewportDimensions => $viewportDimensions.width);
	export const viewportHeight = derived(viewportDimensions, $viewportDimensions => $viewportDimensions.height);

	export function updateViewportDimensions() {
		viewportDimensions.set({ width: window.innerWidth, height: window.innerHeight });
	}

	window.addEventListener('resize', updateViewportDimensions);
	updateViewportDimensions();
</script>
<div class="p-2 z-[1000] fixed top-2 right-2 bg-yellow-300">
	<p class="text-red-500">{`w: ${$viewportWidth} h: ${$viewportHeight}`}</p>
</div>

<script lang="ts">
	import * as rive from '@rive-app/canvas';
	import { onMount } from 'svelte';

	export let src;
	export let autoplay = true;
	export let stateMachines;

	onMount(() => {
		const canvasEl = document.getElementById('rive-canvas');
		const riveInstance = new rive.Rive({
			src,
			autoplay,
			layout: new rive.Layout({
				fit: rive.Fit.Contain,
				alignment: rive.Alignment.Center
			}),
			stateMachines: 'StateMachine1',
			canvas: canvasEl,
			onLoad: () => {
				riveInstance.resizeDrawingSurfaceToCanvas();
			}
		});
	});
</script>

<canvas class="rive-canvas" id="rive-canvas"></canvas>


<style>
    #rive-canvas {
        width: 900px;
        height: 540px;
    }
</style>
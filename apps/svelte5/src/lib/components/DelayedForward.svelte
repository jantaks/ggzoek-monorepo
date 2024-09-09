<script lang="ts">

	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';

	let { target = '/', title = 'de hoofdpagina', delay: delaySeconds = 5 } = $props();

	if (browser) {
		const interval = setInterval(async () => {
			delaySeconds -= 1;
			if (delaySeconds === 0) {
				clearInterval(interval);
				console.log('Invalidating cache (rerunning load functions)');
				await goto(target, { invalidateAll: true });
			}
		}, 1000);
	}
</script>
<p>U wordt over {delaySeconds} seconden doorgestuurd naar {title} </p>
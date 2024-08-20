<script lang="ts">

	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';

	let { target = '/', title = 'de hoofdpagina', delay = 5 } = $props();

	if (browser) {
		const interval = setInterval(async () => {
			delay -= 1;
			if (delay === 0) {
				clearInterval(interval);
				console.log('Invalidating cache (rerunning load functions)');
				await goto(target, { invalidateAll: true, replaceState: true });
			}
		}, 1000);
	}
</script>
<p>U wordt over {delay} seconden doorgestuurd naar {title} </p>
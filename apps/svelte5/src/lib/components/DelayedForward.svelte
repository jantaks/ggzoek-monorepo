<script lang="ts">

	import { browser } from '$app/environment';
	import { goto, invalidateAll } from '$app/navigation';

	let { target = '/', title = 'de hoofdpagina', delay = 5 } = $props();

	if (browser) {
		const interval = setInterval(async () => {
			delay -= 1;
			if (delay === 0) {
				clearInterval(interval);
				await invalidateAll();
				goto(target);
			}
		}, 1000);
	}
</script>
<p>U wordt over {delay} seconden doorgestuurd naar {title} </p>
<script lang="ts">

	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';

	let { target = '/', title = 'de hoofdpagina', delay = 5 } = $props();

	if (browser) {
		const interval = setInterval(() => {
			delay -= 1;
			if (delay === 0) {
				clearInterval(interval);
				goto(target);
			}
		}, 1000);
	}
</script>
<p>U wordt over {delay} seconden doorgestuurd naar {title} </p>
<script lang="ts">
	import type { PageData } from './$types';
	import DelayedForward from '$lib/components/DelayedForward.svelte';

	export let data: PageData;
</script>

<div>Bedankt voor het bevestigen van uw registratie! We hebben u automatisch ingelogd.</div>
<DelayedForward delay=3 target="/zoekresultaten" title="de zoekpagina"></DelayedForward>

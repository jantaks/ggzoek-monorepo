<script lang="ts">
	import type { PageData } from './$types';
	import DelayedForward from '$lib/components/DelayedForward.svelte';

	export let data: PageData;
</script>

<p>U registratie is verwerkt. U ontvangt een email om uw registratie te bevestigen. Klik op de link in deze email om
	automatisch in te loggen.</p>

<DelayedForward delay={3} target="/zoekresultaten" title="de zoekpagina." />


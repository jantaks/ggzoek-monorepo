<script lang="ts">
	import { page } from '$app/stores';
	import DelayedForward from '$lib/components/DelayedForward.svelte';

	const email = $page.url.searchParams.get('email') || '';

</script>

<div>We hebben een email gestuurd naar {email}. In deze mail vind u instructies om uw wachtwoord opnieuw in te stellen
</div>
<DelayedForward></DelayedForward>
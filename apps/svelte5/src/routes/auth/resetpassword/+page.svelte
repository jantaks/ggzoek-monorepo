<script lang="ts">
	import { page } from '$app/stores';

	const email = $page.url.searchParams.get('email') || '';

</script>

<div>We hebben een email gestuurd naar {email}. In deze mail vind u instructies om uw wachtwoord opnieuw in te stellen
</div>
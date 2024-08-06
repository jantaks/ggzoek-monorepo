<script lang="ts">
	import '../app.css';
	import { createSearchForm } from '$lib/stores/formStore.svelte';
	import { createUser } from '$lib/stores/userStore.svelte';
	import { page } from '$app/stores';

	if ($page.data.email) {
		createUser($page.data.email, $page.data.likes);
	}

	createSearchForm();

</script>

<slot></slot>


<style lang="postcss">
    :global(body) {
        @apply bg-gradient-to-br from-indigo-100 to-pink-50
    }
</style>

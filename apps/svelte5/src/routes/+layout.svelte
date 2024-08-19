<script lang="ts">
	import '../app.css';
	import { createSearchForm } from '$lib/stores/formStore.svelte';
	import { createUser } from '$lib/stores/userStore.svelte';
	import { page } from '$app/stores';

	if ($page.data.email) {
		createUser($page.data.email, $page.data.likes);
	}
	console.log('Index layout');

	createSearchForm();
</script>
<slot></slot>
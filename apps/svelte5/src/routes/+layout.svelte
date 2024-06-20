<script lang="ts">
  import '../app.css';
  import { createUser } from '$lib/stores/userStore.svelte';
  import { page } from '$app/stores';
  import { createSearchForm } from '$lib/stores/formStore.svelte';

  const user = createUser($page.data.email, $page.data.likes);

  createSearchForm();

</script>

<slot></slot>


<style lang="postcss">
    :global(body) {
        @apply bg-gradient-to-r from-indigo-50 to-pink-100
    }
</style>

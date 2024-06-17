<script lang="ts">
  import Searchform from '$lib/components/searchform/Searchform.svelte';

  let { data } = $props();

</script>

<Searchform searchResponse={data.searchResponse}></Searchform>

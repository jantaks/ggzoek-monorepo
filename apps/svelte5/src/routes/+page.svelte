<script lang="ts">
  import Searchform from '$lib/components/searchform/Searchform.svelte';
  import FilterBar from '$lib/components/filterBar/FilterBar.svelte';

  let { data } = $props();

</script>
<FilterBar />
<Searchform searchResponse={data.searchResponse}></Searchform>

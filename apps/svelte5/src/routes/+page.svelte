<script lang="ts">
  import Searchform from '$lib/components/searchform/Searchform.svelte';
  import FilterBar from '$lib/components/filterBar/FilterBar.svelte';
  import NavBar from '$lib/components/navbar/NavBar.svelte';
  import VacatureCard from '$lib/components/vacature-card/VacatureCard.svelte';


  let { data } = $props();


</script>


<NavBar></NavBar>
<div class="flex flex-row">
  <div class="w-2/5 min-w-fit">
    <Searchform searchResponse={data.searchResponse}></Searchform>
  </div>
  <div class="w-full">
    <FilterBar />
    <!--    SEARCHRESULTS-->

    <div class="p-4">
      {#each data.searchResponse.hits as hit}
        <VacatureCard hit={hit}></VacatureCard>
      {/each}
    </div>
    <!--   SEARCHRESULTS-->
  </div>
</div>






<script lang="ts">
  import Searchform from '$lib/components/searchform/Searchform.svelte';
  import FilterBar from '$lib/components/results-bar/FilterBar.svelte';
  import NavBar from '$lib/components/navbar/NavBar.svelte';
  import VacatureCard from '$lib/components/vacature-card/VacatureCard.svelte';
  import ResultsBar from '$lib/components/results-bar/ResultsBar.svelte';
  import { formStore } from '$lib/stores/stores.svelte';
  import { Input } from '$lib/components/ui/input';
  import { tick } from 'svelte';
  import Paginator from '$lib/components/pagination/Paginator.svelte';

  let { data } = $props();

  const onchange = (event) => {
    if (event.target) {
      console.log(event.target.value);
      formStore.addInput(event.target.name, event.target.value);
      tick().then(formStore.submit);
    }
  };

</script>


<NavBar class="mb-4 sticky top-0 bg-gray-300"></NavBar>
<div class="flex flex-row mx-auto max-w-7xl">
  <div class="w-2/5 min-w-fit">
    <Searchform facets={data.facets} searchResponse={data.searchResponse}></Searchform>
  </div>
  <div class="ml-4 w-full">
    <Input class="mb-4 border-2 border-pink-500 h-14" id="name" name="fullText" onchange={onchange}
           placeHolder="Zoekcriteria invoeren"
           required
           type="text"
           value={data.query}
    />
    <FilterBar />
    <ResultsBar count={data.searchResponse.estimatedTotalHits} />
    <!--    SEARCHRESULTS-->
    <div>
      {#each data.searchResponse.hits as hit}
        <VacatureCard hit={hit}></VacatureCard>
      {/each}
    </div>
    <Paginator searchResponse={data.searchResponse}></Paginator>

    <!--   SEARCHRESULTS-->
  </div>
</div>






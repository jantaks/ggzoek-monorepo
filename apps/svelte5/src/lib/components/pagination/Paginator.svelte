<script lang="ts">
  import { CaretLeft, CaretRight } from '$lib/components/icons/index';
  import { Pagination } from 'bits-ui';
  import type { SearchResponse } from 'meilisearch';
  import { resultsPerPage } from '$lib/types';
  import { getSearchForm } from '$lib/stores/formStore.svelte';
  import { page } from '$app/stores';

  const form = getSearchForm();

  let offset = parseInt($page.url.searchParams.get('offset') || '0');

  const x = Pagination;

  type Props = {
    searchResponse: SearchResponse
  }

  const perPage = resultsPerPage;

  let { searchResponse }: Props = $props();


  function onPageChange(page: number) {
    form.submit(((page - 1) * perPage));
  }

  let show = $derived.by(() => {
    if (searchResponse && searchResponse.estimatedTotalHits) {
      return searchResponse.estimatedTotalHits > perPage;
    }
    return false;
  });


</script>
{#if show}
  <Pagination.Root count={searchResponse.estimatedTotalHits || 0} let:pages let:range onPageChange={onPageChange}
                   page={offset/perPage+1}
                   perPage={perPage}>
    <div class="my-2 nx-auto flex-row justify-center flex items-center">
      <Pagination.PrevButton
        class="mr-[25px] inline-flex size-10 items-center justify-center rounded-[9px] bg-transparent hover:bg-dark-10 active:scale-98 disabled:cursor-not-allowed disabled:text-muted-foreground hover:disabled:bg-transparent"
      >
        <CaretLeft class="size-6" />
      </Pagination.PrevButton>
      <div class="flex items-center gap-2.5">
        {#each pages as page (page.key)}
          {#if page.type === "ellipsis"}
            <div class="text-[15px] font-medium text-foreground-alt">...</div>
          {:else}
            <Pagination.Page
              {page}
              class="inline-flex size-10 items-center justify-center rounded-[9px] bg-transparent text-[15px] font-medium hover:bg-dark-10 active:scale-98 disabled:cursor-not-allowed disabled:opacity-50 hover:disabled:bg-transparent data-[selected]:bg-foreground data-[selected]:text-background"
            >
              {page.value}
            </Pagination.Page>
          {/if}
        {/each}
      </div>
      <Pagination.NextButton
        class="ml-[29px] inline-flex size-10 items-center justify-center rounded-[9px] bg-transparent hover:bg-dark-10 active:scale-98 disabled:cursor-not-allowed disabled:text-muted-foreground hover:disabled:bg-transparent"
      >
        <CaretRight class="size-6" />
      </Pagination.NextButton>
    </div>
    <p class="text-center text-[13px] text-muted-foreground">
      Getoond: {range.start + 1} t/m {range.end}
    </p>
  </Pagination.Root>
{/if}
<script lang="ts">
  import { CaretLeft, CaretRight } from '$lib/components/icons/index';
  import { Pagination } from 'bits-ui';
  import type { SearchResponse } from 'meilisearch';
  import { formStore } from '$lib/stores/stores.svelte';

  const x = Pagination;

  type Props = {
    searchResponse: SearchResponse
  }

  let { searchResponse }: Props = $props();
  const count = searchResponse.estimatedTotalHits || 0;

  function onPageChange(page: number) {
    formStore.addInput('offset', ((page - 1) * 10).toString());
    formStore.submit();
  }

</script>

<Pagination.Root count={count} let:pages let:range onPageChange={onPageChange} perPage={10}>
  <div class="my-8 flex items-center">
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
    Showing {range.start} - {range.end}
  </p>
</Pagination.Root>
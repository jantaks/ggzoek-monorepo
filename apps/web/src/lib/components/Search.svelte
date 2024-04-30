<script lang="ts">
	import VacatureCard from '$lib/components/VacatureCard.svelte';
	import type { SearchData } from '$lib/types';
	import FrontpageHero from '$lib/components/FrontpageHero.svelte';
	import { page } from '$app/stores';
	import SearchResultBar from '$lib/components/SearchResultBar.svelte';


	export let data: SearchData;
	let timeout = 0;

	async function delay(event) {
		clearTimeout(timeout);
		timeout = setTimeout(() => {
			event.target.form.requestSubmit();
		}, 1000);
	}


	$: $page.url.searchParams.delete('page');
	$: hitcount = data.response?.estimatedTotalHits != null ? data.response.estimatedTotalHits : 0;
	$: showVacatures = data.response?.hits?.length && (data.searchCommand.query || data.searchCommand?.options?.filter?.length);
	$: next = data.response?.offset !== undefined ? data.response.offset + 10 : 0;
	$: previous = data.response?.offset !== undefined ? data.response.offset - 10 : 0;
	$: nextUrl = '/?' + $page.url.searchParams + `&page=${next}`;
	$: previousUrl = '/?' + $page.url.searchParams + `&page=${previous}`;
	$: showNext = hitcount > next;
	$: showPrevious = previous >= 0;
	$: console.log(`next: ${next}, previous: ${previous}, showNext: ${showNext}, showPrevious: ${showPrevious}, hitcount: ${hitcount}`);

</script>


<div class="flex flex-row py-2">

	<main class="flex flex-col items-center w-full pb-10 pt-0">
		{#if !showVacatures}
			<FrontpageHero imageUrls={data.imageUrls}>
			</FrontpageHero>
		{:else}
			<section class="px-6 mb-4 w-full">

				<SearchResultBar hitcount={hitcount}>
				</SearchResultBar>
			</section>
			<div>
				{#each data.response.hits as hit}
					<div class="pb-6 px-2 lg:px-6">
						<VacatureCard vacature={hit._formatted} />
					</div>
				{/each}
			</div>
			<div class="flex flex-row justify-between w-2/5">
				<a href="{previousUrl}"
					 class={`btn btn-primary btn-square ${showPrevious? "": "btn-disabled"}`}>
					<span class="icon-[mdi--arrow-left-thick] size-6"></span>

				</a>
				<a href="{nextUrl}"
					 class={`btn btn-primary btn-square ${showNext? "": "btn-disabled"}`}>
					<span class="icon-[mdi--arrow-right-thick] size-6"></span>
				</a>
			</div>
		{/if}
	</main>


	<!--		<label for="my-drawer-2" class="btn btn-primary drawer-button lg:hidden">Open drawer</label>-->
	<div class="drawer-side">
		<label for="my-drawer-2" aria-label="close sidebar" class="drawer-overlay"></label>
		<ul id="sidebar"
				class=" p-8 lg:m-4 absolute top-20 lg:sticky lg:top-20 rounded-lg max-h-[85vh] overflow-y-auto bg-white lg:bg-transparent overflow-x-hidden ">

		</ul>
	</div>


</div>






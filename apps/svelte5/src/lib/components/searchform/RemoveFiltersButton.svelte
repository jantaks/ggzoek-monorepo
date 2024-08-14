<script lang="ts">
	import Bin from '../icons/Bin.svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import { getSearchForm } from '$lib/stores/formStore.svelte';

	const form = getSearchForm();

	function removeAllFilters() {
		form.clearAllFilters();
		form.submit();
	}

</script>
<Button class='px-0 flex flex-row justify-between uppercase text-xs bg-transparent text-gray-500 hover:bg-transparent '
				onclick={() => removeAllFilters()}>
	<Bin class="size-6  ml-1 hover:text-primary" />
	<span class="text-xs">Verwijder filters</span>
</Button>
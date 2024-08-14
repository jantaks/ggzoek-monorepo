<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import { SquareArrowUpRight } from 'lucide-svelte';

	type Props = {
		url?: string;
	}

	const { url }: Props = $props();

</script>
<a href={url} target="_blank">
	<Button
		class="px-2 h-8 border-primary-light border shadow flex flex-row items-center justify-between font-bold bg-transparent text-slate-900 bg-white hover:border-primary hover:bg-white ">
		<SquareArrowUpRight class="text-primary size-5 mr-1 "></SquareArrowUpRight>
		<p class="text-xs text-slate-900">Website</p>
	</Button>
</a>

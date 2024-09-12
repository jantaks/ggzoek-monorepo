<script lang="ts">
	import { SquareArrowUpRight } from 'lucide-svelte';
	import Button3 from '$lib/components/ui/button/Button3.svelte';

	type Props = {
		url?: string;
	}

	const { url }: Props = $props();

</script>
<a href={url} target="_blank">
	<Button3 icon={SquareArrowUpRight}>
		<p class="hidden md:flex text-xs">Website</p>
	</Button3>
</a>

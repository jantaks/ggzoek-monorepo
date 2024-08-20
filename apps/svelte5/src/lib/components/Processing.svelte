<script lang="ts">
	import { LoaderCircle } from 'lucide-svelte';

	type Props = {
		processing: boolean,
	}

	const { processing }: Props = $props();
</script>


{#if processing}
	<div class="flex flex-row items-center justify-center w-full">
		<LoaderCircle class="animate-spin size-14 text-secondary-800" />
	</div>
{/if}
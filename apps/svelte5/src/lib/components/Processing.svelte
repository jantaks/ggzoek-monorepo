<script lang="ts">
	import { LoaderCircle } from 'lucide-svelte';

	type Props = {
		processing: boolean,
		class?: string
	}

	const { processing, class: className }: Props = $props();
</script>
{#if processing}
	<div class="flex flex-row items-center justify-center w-full">
		<LoaderCircle class={`animate-spin  text-secondary-800 size-14 ${className}`} />
	</div>
{/if}
<script lang="ts">
	import type { Snippet } from 'svelte';
	import { twMerge } from 'tailwind-merge';

	type Props = {
		class?: string;
		children: Snippet
	}

	const { class: className, children, ...rest }: Props = $props();
</script>

<button {...rest}
				class={twMerge(" text-secondary-900 rounded-lg px-2 h-8 border-secondary-light border shadow flex flex-row items-center justify-between font-bold  bg-grijs-100/70 hover:border-secondary hover:bg-white", className)}>
	{@render children()}
</button>
<script lang="ts">
	import { type ComponentType, type Snippet, tick } from 'svelte';
	import { twMerge } from 'tailwind-merge';
	import { cva } from 'class-variance-authority';
	import { isChunkLike } from '@supabase/ssr';

	type Props = {
		icon?: ComponentType;
		iconClass?: string;
		updatePending?: boolean
		children: Snippet;
		class?: string;
		variant?: 'primary' | 'secondary';
		size?: 'small' | 'medium' | 'large';
	};

	const { updatePending, iconClass, icon, class: className, variant, size, children, ...rest }: Props = $props();

	const classList = cva(['group flex h-8 flex-row items-center justify-between space-x-1 rounded px-2 text-sm font-normal shadow shadow-grijs hover:border-secondary'], {
		variants: {
			intent: {
				primary: ' bg-transparent text-secondary-900 hover:bg-primary/70',
				secondary: 'bg-primary text-primary-900 hover:border hover:border-primary hover:bg-primary-900 hover:text-primary'
			},
			size: {
				small: 'h-8 text-sm',
				medium: 'h-10 p-4 text-base',
				large: 'h-12 p-5 text-lg'
			}
		},
		defaultVariants: {
			intent: 'primary',
			size: 'small'
		}
	});


</script>

<button
	{...rest}
	class={twMerge(classList({intent: variant, size:size}), className)}
	disabled={updatePending}
>
	{#if icon}
		<svelte:component class={twMerge(`size-5 mr-1 ${!updatePending? "group-hover:scale-110": ""} `, iconClass)}
											this={icon}></svelte:component>
	{/if}
	{@render children()}
</button>

<script lang="ts">
	import { twMerge } from 'tailwind-merge';

	type Props = {
		variant?: 'small' | 'default' | 'large'
	}
	let { variant }: Props = $props();

	if (!variant) {
		variant = 'large';
	}

	let className = {
		small: 'text-2xl px-2 font-light',
		default: 'text-3xl px-2 font-semibold',
		large: 'text-6xl px-2 font-semibold'
	}[variant];

</script>


<h1 class={twMerge(className, "font-sans font-medium")}><a href="/zoekresultaten">gg<span
	class="text-primary">zoek</span></a></h1>
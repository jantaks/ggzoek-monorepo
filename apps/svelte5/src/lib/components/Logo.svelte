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
		small: 'text-2xl  font-light',
		default: 'text-3xl  font-semibold',
		large: 'text-6xl  font-semibold'
	}[variant];

</script>


<h1 class={twMerge(className, "font-sans font-medium")}><a href="/">gg<span
	class="text-primary">zoek</span></a></h1>
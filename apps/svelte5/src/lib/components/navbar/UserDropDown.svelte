<script lang="ts">
	import { getUser } from '$lib/stores/userStore.svelte';
	import { createDropdownMenu, melt } from '@melt-ui/svelte';
	import { fly } from 'svelte/transition';

	const user = getUser();

	type Props = {
		class?: string
	}

	let { class: className }: Props = $props();

	const {
		elements: { trigger, menu, item, separator, arrow }
	} = createDropdownMenu({
			loop: true,
			arrowSize: 20
		}
	);

</script>

<div
	class={"bg-primary rounded-full p-2 text-white size-10 hover:ring flex items-center justify-center" + className}>
	<button use:melt={$trigger}>
		<span class="uppercase text-sm font-bold">{user.initials}</span>
	</button>
	<div class="menu" transition:fly={{ duration: 150, y: -10 }} use:melt={$menu}>
		<div {...$item} class="item" use:item>{user.email}</div>
		<div {...$item} class="item" use:item>Bewaarde vacatures ({user.likes.length})</div>
		<div {...$item} class="item" use:item>
			<a data-sveltekit-reload href="/auth/logout">Uitloggen</a>
		</div>
		<div use:melt={$arrow}></div>
	</div>
</div>

<style lang="postcss">
    .menu {
        @apply z-10 flex max-h-[300px] min-w-[220px] flex-col shadow-lg shadow-neutral-900/30;
        @apply rounded-md bg-white p-2 lg:max-h-none;
        @apply ring-0 !important;
    }

    .subMenu {
        @apply min-w-[220px] shadow-md shadow-neutral-900/30;
    }

    .item {
        @apply relative h-6 min-h-[24px] select-none rounded-sm pl-6 pr-1 py-2 mb-0.5;
        @apply z-20 text-primary-dark outline-none;
        @apply data-[highlighted]:bg-primary-light data-[highlighted]:text-primary-dark;
        @apply data-[disabled]:text-neutral-300;
        @apply flex items-center text-sm leading-none;
        @apply cursor-default ring-0 !important;
    }

    .trigger {
        @apply inline-flex items-center justify-center rounded-md bg-white px-3 py-2;
        @apply text-primary-dark transition-colors hover:bg-white/90 data-[highlighted]:outline-none;
        @apply overflow-visible data-[highlighted]:bg-primary-light data-[highlighted]:ring-primary !important;
        @apply !cursor-default text-sm font-medium leading-none focus:z-30 focus:ring;
    }

    .check {
        @apply absolute left-2 top-1/2 text-primary;
        translate: 0 calc(-50% + 1px);
    }

    .dot {
        @apply h-[4.75px] w-[4.75px] rounded-full bg-primary-dark;
    }

    .separator {
        @apply m-[5px] h-[1px] bg-primary-light;
    }

    .rightSlot {
        @apply ml-auto pl-5;
    }

    .check {
        @apply absolute left-0 inline-flex w-6 items-center justify-center;
    }

    .text {
        @apply pl-6 text-xs leading-6 text-neutral-600;
    }
</style>
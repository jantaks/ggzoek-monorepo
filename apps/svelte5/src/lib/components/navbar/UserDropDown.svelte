<script lang="ts">
	import { getUser } from '$lib/stores/userStore.svelte';
	import { createDropdownMenu, melt } from '@melt-ui/svelte';
	import { fly, scale } from 'svelte/transition';

	const user = getUser();

	console.log('FROM USERDROPDOWN: ', user);

	type Props = {
		class?: string
	}

	let { class: className }: Props = $props();

	const {
		elements: { trigger, menu, item, arrow }
	} = createDropdownMenu({
			loop: true,
			arrowSize: 10
		}
	);


</script>

<div
	class={"bg-primary rounded-lg p-2 text-white size-8 hover:ring flex items-center justify-center" + className}>
	<button class="relative" use:melt={$trigger}>
		<span class="uppercase text-sm font-bold">{user?.initials}</span>
		{#key user?.likes?.length}
		<span in:scale={{ duration: 1000, start: 0.5 }}
					class={`absolute -top-4 left-4 bg-secondary text-xs rounded-full py-1  ${user.likes?.length>9? "px-1.5": "px-2"}`}>{user?.likes?.length}</span>
		{/key}
	</button>

	<div class="menu" transition:fly={{ duration: 150, y: -10 }} use:melt={$menu}>
		<div class="heading text-center justify-center">{user?.email}</div>

		<hr class="h-px my-1  border-1 dark:bg-gray-700">
		<div {...$item} class="item" use:item>
			<a data-sveltekit-reload href="/bewaard">Bewaarde vacatures ({user?.likes?.length})</a>
		</div>
		<div {...$item} class="item" use:item>
			<a data-sveltekit-reload href="/auth/resetpassword/form">Wachtwoord wijzigen</a>
		</div>
		<div {...$item} class="item" use:item>
			<a data-sveltekit-reload href="/auth/logout">Uitloggen</a>
		</div>
		<div use:melt={$arrow}></div>
	</div>
</div>

<style lang="postcss">
    .menu {
        @apply relative z-10 flex max-h-[300px] min-w-[220px] flex-col shadow-lg shadow-neutral-900/30;
        @apply rounded-md bg-white py-2 lg:max-h-none;
        @apply ring-0 !important;
    }

    .heading {
        @apply relative h-6 min-h-[24px] select-none rounded-sm pl-6 pr-1 py-3 mb-0.5;
        @apply flex items-center text-sm leading-none;
        @apply z-20 text-secondary-900 outline-none;
    }

    .item {
        @apply relative h-6 min-h-[24px] select-none rounded-sm pl-6 pr-1 py-2 mb-0.5;
        @apply z-20 text-secondary-900 outline-none;
        @apply data-[highlighted]:bg-primary-light data-[highlighted]:text-primary-dark;
        @apply data-[disabled]:text-neutral-300;
        @apply flex items-center text-sm leading-none;
        @apply cursor-default ring-0 !important;
    }

</style>
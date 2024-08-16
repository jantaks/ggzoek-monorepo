<script lang="ts">
	import UserDropDown from '$lib/components/navbar/UserDropDown.svelte';
	import { page } from '$app/stores';
	import Logo from '$lib/components/Logo.svelte';

	type Props = {
		class?: string
		showLogin?: boolean
		showLinks?: boolean
	}

	let { class: className, showLogin, showLinks }: Props = $props();
	let loggedIn = $derived.by(() => {
		return !!$page.data.email;
	});


</script>

<div class={"w-full " + className}>
	<nav class={"flex items-center py-2 mx-auto max-w-7xl justify-between pr-10"}>
		<Logo variant="small" />
		{#if showLinks}
			<ul class="hidden sm:flex flex-row  gap-8 mx-auto items-center">
				<li><a href="/">Home</a></li>
				<li><a href="/pages/about">Over ons</a></li>
				<li><a href="/">Instellingen</a></li>
				<li><a href="/">Professionals</a></li>
			</ul>
		{/if}
		{#if loggedIn && showLogin}
			<UserDropDown class=""></UserDropDown>
		{:else if showLogin}
			<a href="/auth/login?next=zoekresultaten" class="hidden sm:flex text-primary">inloggen</a>
		{/if}
	</nav>
</div>

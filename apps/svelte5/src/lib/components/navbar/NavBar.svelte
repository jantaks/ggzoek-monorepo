<script lang="ts">
	import UserDropDown from '$lib/components/navbar/UserDropDown.svelte';
	import { page } from '$app/stores';
	import Logo from '$lib/components/Logo.svelte';
	import { Button } from '$lib/components/ui/button';
	import { getUser } from '$lib/stores/userStore.svelte';

	const user = getUser();

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

	<nav class={"flex items-center py-4 mx-auto max-w-7xl justify-between pr-10"}>
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
			<a href="/auth/login?next=zoekresultaten">
				<Button
					class="px-4 h-8 text-white flex flex-row items-center justify-between bg-transparent  bg-primary hover:border-primary hover:text-primary hover:bg-white ">
					<p>Inloggen</p>
				</Button>
			</a>
		{/if}
	</nav>
</div>

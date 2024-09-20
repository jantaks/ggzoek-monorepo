<script lang="ts">
	import UserDropDown from '$lib/components/navbar/UserDropDown.svelte';
	import { page } from '$app/stores';
	import Logo from '$lib/components/Logo.svelte';
	import { Button } from '$lib/components/ui/button';
	import { getUser } from '$lib/stores/userStore.svelte';
	import Button3 from '$lib/components/ui/button/Button3.svelte';

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
<div class={"w-full sticky top-0 z-30 bg-secondary-900 text-primary-200" }>
	<nav class={"flex items-center py-2 2xl:py-4 mx-auto justify-between max-w-7xl px-4"}>
		<Logo variant="small" />
		{#if showLinks}
			<ul class="hidden sm:flex flex-row gap-8 mx-auto items-center">
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
				<Button3
					variant="secondary">
					<p>Inloggen</p>
				</Button3>
			</a>
		{/if}
	</nav>
</div>

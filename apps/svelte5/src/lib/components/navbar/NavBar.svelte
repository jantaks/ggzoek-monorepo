<script>
	import UserDropDown from '$lib/components/navbar/UserDropDown.svelte';
	import { page } from '$app/stores';

	let { class: className } = $props();
	let loggedIn = $derived.by(() => {
		return !!$page.data.email;
	});


</script>

<div class={"w-full " + className}>
	<nav class={"flex items-center py-2 mx-auto max-w-7xl justify-between pr-10"}>
		<h1 class="text-3xl px-2 border-b-1"><a href="/">gg<span class="text-pink-300">zoek</span></a></h1>
		<ul class="flex flex-row gap-8 mx-auto items-center">
			<li><a href="/">Home</a></li>
			<li><a href="/pages/about">Over ons</a></li>
			<li><a href="/">Instellingen</a></li>
			<li><a href="/">Professionals</a></li>
		</ul>
		{#if loggedIn}
			<UserDropDown class=""></UserDropDown>
		{:else}
			<a href="/auth/login?next=zoekresultaten" class="text-pink-300">inloggen</a>
		{/if}
	</nav>
</div>

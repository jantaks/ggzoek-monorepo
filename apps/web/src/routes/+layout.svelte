<script lang="ts">
	import { AppShell, Drawer, initializeStores, storePopup, Toast } from '@skeletonlabs/skeleton';
	import '../app.css';
	import Navbar from '$lib/components/Navbar.svelte';
	import { email, likesCounter } from '$lib/stores';
	import SearchForm from '$lib/components/SearchForm.svelte';
	import { arrow, autoUpdate, computePosition, flip, offset, shift } from '@floating-ui/dom';

	initializeStores();

	storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow });

	export let data;

	$: email.set(data.email);
	$: likesCounter.set(data.likes.length);


</script>
<Toast />
<Drawer />
<AppShell>
	<svelte:fragment slot="header">
		<Navbar />
		<div class="block lg:hidden" slot="sidebarLeft">
			<SearchForm />
		</div>
	</svelte:fragment>
	<div class="hidden lg:inline" slot="sidebarLeft">
		<SearchForm />
	</div>
	<!--	<svelte:fragment slot="pageHeader">-->
	<!--		Page Header-->
	<!--	</svelte:fragment>-->
	<slot />
	<svelte:fragment slot="footer">
		FOOTER
	</svelte:fragment>
</AppShell>

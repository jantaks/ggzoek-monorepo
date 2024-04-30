<script lang="ts">
	import Logo from '$lib/components/Logo.svelte';
	import { alerts, email, likesCounter } from '$lib/stores';
	import { AppBar, Avatar, LightSwitch, popup, type PopupSettings } from '@skeletonlabs/skeleton';


	$: initials = $email ? $email[0].toUpperCase() : 'LL';

	$: {
		if ($alerts !== undefined) {
			setTimeout(() => {
				$alerts = undefined;
			}, 1500);
		}
	}

	let comboboxValue: string;

	const popupCombobox: PopupSettings = {
		event: 'click',
		target: 'popupCombobox',
		placement: 'bottom',
		closeQuery: '.listbox-item'
	};

</script>


<AppBar slotDefault="flex justify-center">
	<svelte:fragment slot="lead">
		<Logo />
		<a class="btn btn-ghost text-xl hover:bg-transparent" href="/">GGZOEK</a>
	</svelte:fragment>
	<div class="hidden lg:inline-flex space-x-20">
		<a href="/" class="btn text-lg hover:variant-soft-primary">Instellingen</a>
		<a href="/" class="btn text-lg hover:variant-soft-primary">Professionals</a>
		<a href="/" class="btn text-lg hover:variant-soft-primary">Over GGZoek</a>
	</div>
	<svelte:fragment slot="trail">
		<LightSwitch />
		<div class="hidden lg:block">
			{#if $email}
				<button class="" use:popup={popupCombobox}>
					<Avatar initials={initials} />
				</button>
				<div class="card w-48 shadow-xl p-2" data-popup="popupCombobox">
					<!-- (optionally you can provide a label here) -->
					<ul class="list space-y-2">
						<li>
							<span class="bg-primary-500 icon-[mdi--email-outline] size-6 "></span>
							<span class="flex-auto">Skeleton</span>
						</li>
						<li>
							<span class="bg-primary-500 icon-[mdi--email-outline] size-6 hover:bg-primary-50"></span>
							<span class="flex-auto">{$likesCounter} favorieten</span>
						</li>
						<li>
							<a href="/auth/logout">
								<span class="bg-primary-500 icon-[mdi--logout] size-6"></span>
								<button type="submit">Uitloggen</button>
							</a>
						</li>
					</ul>
				</div>
			{:else}
				<a href="/auth/login" class="">Inloggen</a>
				<a href="/auth/register" class="btn btn-primary">Registreren</a>
			{/if}
		</div>
	</svelte:fragment>
</AppBar>


<script lang="ts">
	import type { ActionData } from './$types';
	import Processing from '$lib/components/Processing.svelte';
	import { Info, TriangleAlert } from 'lucide-svelte';
	import type { Snippet } from 'svelte';

	type Props = {
		form: ActionData,
		formAction: string,
		header: snippet
		inputs: Snippet
		buttons: Snippet
		validationErrors: string[]
		message: string
	}

	const { form, formAction, inputs, buttons, header }: Props = $props();


	let processing = $state(false);
	let validationErrors = $state<string>(form?.errors);

</script>


{#snippet info(message)}
	<div class=" flex flex-row justify-items-center">
		<Info class="animate-pulse text-secondary-900 min-w-6 min-h-6 mr-2" />
		<h2 class="">{message}</h2>
	</div>
{/snippet}

{#snippet error(message)}
	<div class=" flex flex-row justify-items-center">
		<TriangleAlert class="animate-pulse text-red-500 min-w-6 min-h-6 mr-2" />
		<h2 class="">{message}</h2>
	</div>
{/snippet}

<Processing processing={processing} />
<section class={`${processing? "hidden": ""} space-y-4`}>
	<h1 class="text-center font-semibold text-xl text-secondary-900">
		{@render header}
	</h1>
	{#if message}
		{@render info(message)}
	{/if}
	{#if validationErrors}
		{@render error(validationErrors)}
	{/if}
	<form action={formAction} class="space-y-4 pt-4 pb-1"
				method="post"
				onsubmit={() => processing = !processing}
	>
		{@render inputs()}
		{@render buttons()}
	</form>

</section>




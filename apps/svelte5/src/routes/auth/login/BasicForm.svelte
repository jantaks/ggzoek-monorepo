<script lang="ts">
	import type { ActionData } from './$types';
	import Processing from '$lib/components/Processing.svelte';
	import { Info, TriangleAlert } from 'lucide-svelte';
	import type { Snippet } from 'svelte';

	type Props = {
		form: ActionData,
		formAction: string,
		inputs: Snippet
		buttons: Snippet
		header?: Snippet
		message?: string
		errors?: string
	}

	let { form, formAction, header, inputs, buttons, message, errors }: Props = $props();
	let processing = $state(false);

</script>


{#snippet info(message)}
	<div class=" flex flex-row  justify-center bg-secondary/20 p-2">
		<Info class="animate-pulse text-secondary-900 min-w-6 min-h-6 mr-2" />
		<h2 class="">{message}</h2>
	</div>
{/snippet}

{#snippet error(message)}
	<div class=" flex flex-row  justify-center bg-primary/20 p-2">
		<TriangleAlert class="animate-pulse text-red-500 min-w-6 min-h-6 mr-2" />
		<h2 class="">{message}</h2>
	</div>
{/snippet}

<Processing processing={processing} />
<section class={`${processing? "hidden": ""} space-y-4`}>
	{#if header}
		<h1 class="text-center font-semibold text-xl text-secondary-900">
			{@render header()}
		</h1>
	{/if}
	{#if message && !errors}
		{@render info(message)}
	{/if}
	{#if errors}
		{@render error(errors)}
	{/if}
	<form action={formAction} class="space-y-4 pt-4 pb-1"
				method="post"
				onsubmit={()=> processing = true}
	>
		{@render inputs()}
		{@render buttons()}
	</form>
</section>




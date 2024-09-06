<script lang="ts">

	import type { Snippet } from 'svelte';

	type Props = {
		showModal?: boolean;
		header?: Snippet;
		content?: Snippet;
	}

	let { showModal = $bindable(), header, content } = $props();

	let dialog; // HTMLDialogElement

	$effect(() => {
		if (showModal) {
			dialog.showModal();
		}
	});

</script>

<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-noninteractive-element-interactions -->
<dialog bind:this={dialog}
				class="w-screen bg-primary h-screen"
				onclose={() => (() => {console.log("CLossing modal "); showModal = false})}
>
	<div>
		{#if header}
			{@render header()}
		{/if}
		{#if content}
			{@render content()}
		{/if}
		<button autofocus onclick={() => dialog.close()}>close modal</button>
	</div>
</dialog>

<style>
    dialog {
        @apply h-dvh;
        max-width: 32em;
        border-radius: 0.2em;
        border: none;
        padding: 0;
    }

    dialog::backdrop {
        @apply bg-secondary-900;
    }

    dialog > div {
        padding: 1em;
    }

    dialog[open] {
        animation: zoom 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    }

    @keyframes zoom {
        from {
            transform: scale(0.95);
        }
        to {
            transform: scale(1);
        }
    }

    dialog[open]::backdrop {
        animation: fade 0.2s ease-out;
    }

    @keyframes fade {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }

    button {
        display: block;
    }
</style>

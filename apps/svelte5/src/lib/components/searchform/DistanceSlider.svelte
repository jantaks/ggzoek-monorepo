<script lang="ts">
	import { Label, Slider } from 'bits-ui';
	import { getSearchForm } from '$lib/stores/formStore.svelte';

	const x = { Slider, Label };

	const form = getSearchForm();

	type Props = {
		disabled: boolean;
	}

	let { disabled }: Props = $props();

	const delayedSubmit = (delay: number) => {
		let timeout: number;
		return () => {
			clearTimeout(timeout);
			timeout = setTimeout(() => {
				form.submit();
				console.log('submit');
			}, delay);
		};
	};

</script>

<div class="w-full">
	<Label.Root
		class="text-primary-light text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
		for="distance-slider"
		id="distance-slider-label"
	>
		Afstand: {disabled ? 'selecteer eerst een postcode' : `${form.distance} km`}
	</Label.Root>
	<Slider.Root
		bind:value={form.distance}
		class="mt-1 relative flex w-full touch-none select-none items-center"
		disabled={disabled}
		id="distance-slider"
		let:thumbs
		max={150}
		min={0}
		onValueChange={delayedSubmit(500)}
		step={10}
	>
    <span
			class="relative h-2 w-full grow overflow-hidden rounded-full bg-gray-300"
		>
      <Slider.Range class="absolute h-full bg-foreground" />
    </span>
		{#each thumbs as thumb}
			<Slider.Thumb
				{thumb}
				class="block size-[20px] cursor-pointer rounded-full border bg-white shadow
          transition-colors hover:border-primary focus-visible:outline-none focus-visible:ring-2
          focus-visible:ring-foreground focus-visible:ring-offset-2 active:scale-98 disabled:pointer-events-none
           disabled:opacity-50 dark:bg-foreground dark:shadow-card"
			/>
		{/each}
	</Slider.Root>
</div>
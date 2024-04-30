<script lang="ts">
	import { slide } from 'svelte/transition';

	export let open = false;
	let btnText = 'Toon filters';
	let cls = 'hidden';

	function toggle() {
		open = !open;
		cls = open ? 'flex' : 'hidden';
		btnText = open ? 'Verberg filters' : 'Toon filters';
	}

</script>

<div class="flex flex-col">
	<div class="px-4 py-4 bg-white lg:bg-transparent fixed top-0 z-50 w-full lg:w-fit lg:static">
		<slot name="show"></slot>
		<div class="{cls} lg:flex" transition:slide={{duration:700}}>
			<slot name="hidden"></slot>
		</div>
		<button class="flex lg:hidden hover:bg-gray-500 py-3 justify-center  w-full bg-base-100"
						on:click={toggle}>{btnText}</button>
	</div>
	{#if open}
		<div on:click={toggle} transition:slide={{duration:700}}
				 class="z-30 w-screen h-screen absolute lg:invisible bg-gray-500 opacity-50 cursor-pointer duration-500  overflow-hidden"
		/>
	{/if}
</div>




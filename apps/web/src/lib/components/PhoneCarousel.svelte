<script lang="ts">
    import {slide, type SlideParams} from "svelte/transition"


    export let imageUrls: string[]

    let images = [randomImageUrl(), randomImageUrl(), randomImageUrl()]

    let replaced = [false, false, false]
    function randomImageUrl() {
        return imageUrls[Math.floor(Math.random() * imageUrls.length)]
    }

    // eslint-disable-next-line no-undef
    let timeout: NodeJS.Timeout
    let delay = 50
    let currentcontainer = 0

    $: if (typeof window !== 'undefined') {
        timeout = setTimeout(() => {

            const img = new Image();
            img.src = randomImageUrl();
            img.onload = () => {
                currentcontainer = currentcontainer < 3? currentcontainer + 1 : 0
                console.log("Changing image ", currentcontainer)
                images[currentcontainer] = img.src;
                replaced[currentcontainer] = !replaced[currentcontainer]
                delay = delay * 1.1
                console.log("Next change in ", delay)
            };

        }, delay);

    }

    const slideParams: SlideParams = {axis: 'x'}
//     TODO; maak er een fatsoenlijke slideshow van, zie: https://svelte.dev/repl/a363db348ba4485d965c5b5464428a73?version=3.31.2
</script>

<!--https://svelte.dev/examples/deferred-transitions-->

<div class="relative opacity-80">
    <div class="mockup-phone -rotate-12 transition-all delay-500 w-[300px] h-[570px] left-[100px] shadow-md shadow-primary">
        <div class="camera"></div>
        <div class="display pt-8 pb-10 bg-white -z-50 w-[273px] h-[543px]">
            {#if replaced[0] === true}
                <img class="object-cover" src={images[0]} >
            {:else}
                <img class="object-cover" src={images[0]} >
            {/if}
        </div>
    </div>
    <div class="mockup-phone -rotate-0 max-w-xs left-[120px] shadow-md shadow-primary">
        <div class="camera"></div>
        <div class="display pt-8 pb-10 bg-white -z-50 w-[273px] h-[543px]">
            {#if replaced[1] === true}
                <img class="object-cover" src={images[1]} >
            {:else}
                <img class="object-cover" src={images[1]} >
            {/if}
        </div>
    </div>
    <div class="mockup-phone rotate-12  left-[120px] max-w-xs shadow-md shadow-primary">
        <div class="camera"></div>
        <div class="display pt-8 pb-10 bg-white -z-50 w-[273px] h-[543px]">
            {#if replaced[2] === true}
                <img class="object-cover" src={images[2]} >
            {:else}
                <img class="object-cover" src={images[2]} >
            {/if}
        </div>
    </div>
</div>
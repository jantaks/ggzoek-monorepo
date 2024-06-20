<script lang="ts">
  import { Button } from '$lib/components/ui/button/index.js';
  import { Heart, Hourglass } from 'lucide-svelte';
  import { getUser } from '$lib/stores/userStore.svelte';
  import { goto } from '$app/navigation';

  const user = getUser();

  type Props = {
    urlhash?: string;
  }
  const { urlhash }: Props = $props();

  let liked = $derived.by(() => {
    if (user.likes && urlhash) {
      return user.likes.includes(urlhash);
    }
    return false;
  });

  let updatePending = $state(false);

  async function handleClick() {
    if (!user.email) {
      await goto('/auth/login');
    }
    updatePending = true;
    await user.toggleLike(urlhash);
    updatePending = false;
  }

</script>
{#if updatePending}
  <div
    class="px-2 h-8 flex flex-row items-center">
    <Hourglass class="flex text-pink-600 size-5 mr-1 "></Hourglass>
  </div>

{:else}
  <Button
    class="px-2 h-8 border-pink-200 border shadow flex flex-row items-center justify-between font-bold bg-transparent text-slate-900 bg-white hover:border-pink-500 hover:bg-white "
    onclick={handleClick}>
    <Heart class={`text-pink-600 size-5 mr-1 ${liked? "fill-pink-600" : "" }`}></Heart>
    <p class="text-xs text-slate-900">{liked ? "Bewaard" : "Bewaar"}</p>
  </Button>
{/if}



<script>
  import UserDropDown from '$lib/components/navbar/UserDropDown.svelte';
  import { page } from '$app/stores';

  let { class: className } = $props();
  let loggedIn = $derived.by(() => {
    return !!$page.data.email;
  });


</script>

<div class={"w-full " + className}>
  <nav class={"flex items-center py-2 mx-auto max-w-7xl justify-between"}>
    <h1 class="text-2xl text-pink-600 font-bold px-2 border-b-1">GGZOEK</h1>
    <ul class="flex flex-row gap-8 mx-auto items-center">
      <li><a href="/">Home</a></li>
      <li><a href="/">Over ons</a></li>
      <li><a href="/">Instellingen</a></li>
      <li><a href="/">Professionals</a></li>
    </ul>
    {#if loggedIn}
      <UserDropDown class=""></UserDropDown>
    {:else}
      <a href="/auth/login" class="text-pink-600">Login</a>
    {/if}
  </nav>
</div>

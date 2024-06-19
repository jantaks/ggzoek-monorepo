<script>
  let { class: className } = $props();
</script>

<div class={"w-full " + className}>
  <nav class={"flex items-center py-2 mx-auto max-w-7xl "}>
    <h1 class="text-2xl text-gray-900 font-bold px-2 border-b-1">GGZOEK</h1>
    <ul class="flex flex-row gap-8 mx-auto">
      <li><a href="/">Home</a></li>
      <li><a href="/">Over ons</a></li>
      <li><a href="/">Instellingen</a></li>
      <li><a href="/">Professionals</a></li>
    </ul>
  </nav>
</div>

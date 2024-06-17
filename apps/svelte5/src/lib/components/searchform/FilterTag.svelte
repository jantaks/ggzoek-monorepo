<script lang="ts">
  import { Button } from '$lib/components/ui/button/index.js';

  type Props = {
    removeFilter: () => void,
    facet: string,
    value: string,
  }

  let { value, removeFilter }: Props = $props();

</script>


<Button class='p-4 flex flex-row justify-between'>
  {value}
  <button onclick={removeFilter(value)}>X</button>
</Button>
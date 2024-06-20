<script lang="ts">

  import { getSearchForm } from '$lib/stores/formStore.svelte.js';

  const formData = getSearchForm();

  function submit(event: Event) {
    event.preventDefault();
    console.log(formData.query);
    console.log(formData.postcode);
    formData.submit();
  }
</script>

<form action="/" method="GET" onsubmit={submit}>
  <input bind:value={formData.query} name="fullText" onchange={submit} type="text" />
  <input bind:value={formData.postcode} type="text" />
  <button type="submit">Submit</button>
</form>
<div>
  <pre>{formData.query}</pre>
  <pre>{formData.postcode}</pre>
</div>

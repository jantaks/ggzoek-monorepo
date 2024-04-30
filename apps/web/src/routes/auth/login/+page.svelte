<script lang="ts">
	import LoginForm from '$lib/components/LoginForm.svelte';
	export let form;
	export let action = "?/login"
	export let data: { next: string };
</script>
<div class="flex flex-col items-center justify-center grow h-screen">
	<LoginForm form={form} action={action} next={data.next}>
		<span slot="header">Login</span>
	</LoginForm>
</div>



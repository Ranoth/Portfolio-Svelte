<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData, SubmitFunction } from "./$types";

	export let form: ActionData;

	let loading = false;

	const animateWait: SubmitFunction = async () => {
		loading = true;
		return async ({ update }) => {
			loading = false;
			await update();
		};
	};
</script>

<svelte:head>
	<title>Contact</title>
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	<meta name="description" content="Contactez-moi">
</svelte:head>

{#if !form?.success ?? false}
	<form
		method="POST"
		action="?/postContact"
		use:enhance={animateWait}
		class="grid grid-cols-2 items-stretch gap-3">
		<div>
			<label for="name">Nom :</label>
			<input
				class="input-bordered input w-full border-accent"
				type="text"
				name="name"
				placeholder="Jean Dupon"
				value={form?.data?.name ?? ""}
				class:border-red-600={form?.errors?.name ?? false} />
			{#if form?.errors?.name ?? false}
				<p class="text-xs text-red-600">{form?.errors?.name[0]}</p>
			{/if}
		</div>
		<div>
			<label for="email">Email :</label>
			<input
				class="input-bordered input w-full border-accent"
				type="text"
				name="email"
				placeholder="préfixe@domaine.tld"
				value={form?.data?.email ?? ""}
				class:border-red-600={form?.errors?.email ?? false} />
			{#if form?.errors?.email ?? false}
				<p class="text-xs text-red-600">{form?.errors?.email[0]}</p>
			{/if}
		</div>
		<div class="col-span-2">
			<label for="subject">Sujet :</label>
			<input
				class="input-bordered input w-full border-accent"
				type="text"
				name="subject"
				placeholder="Sujet"
				value={form?.data?.subject ?? ""}
				class:border-red-600={form?.errors?.subject ?? false} />
			{#if form?.errors?.subject ?? false}
				<p class="text-xs text-red-600">{form?.errors?.subject[0]}</p>
			{/if}
		</div>
		<div class="col-span-2">
			<label for="message">Message :</label>
			<textarea
				class="textarea-bordered textarea w-full border-accent"
				name="message"
				rows="6"
				placeholder="Votre message"
				value={form?.data?.message?.toString() ?? ""}
				class:border-red-600={form?.errors?.message ?? false} />
			{#if form?.errors?.message ?? false}
				<p class="text-xs text-red-600">{form?.errors?.message[0]}</p>
			{/if}
		</div>
		<button
			type="submit"
			aria-busy={loading}
			class="btn-primary btn col-span-2">
			{#if loading}
				<iconify-icon
					icon="icomoon-free:spinner2"
					width="24"
					height="24"
					class:animate-spin={loading} />
			{:else}
				Send
			{/if}
		</button>
	</form>
{:else}
	<div class="text-center">
		<h1 class="text-5xl">Merci pour votre message</h1>
		<button
			class="btn-primary btn m-5"
			on:click={() => {
				if (form) {
					form.success = false;
				}
			}}>Retourner au formulaire</button>
	</div>
{/if}

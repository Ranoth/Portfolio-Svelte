<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData, SubmitFunction } from './$types';
	import captchaEnhance from 'svelte-captcha-enhance';
	import { PUBLIC_RECAPTCHA_SITE_KEY } from '$env/static/public';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

	export let form: ActionData;

	let loading = false;
	let recaptchaReady = false;

	const isRecaptchaEnabled = !!PUBLIC_RECAPTCHA_SITE_KEY;

	// Function to check if reCAPTCHA is ready
	const checkRecaptchaReady = () => {
		return browser && typeof globalThis.grecaptcha !== 'undefined' && globalThis.grecaptcha.ready;
	};

	onMount(() => {
		if (!isRecaptchaEnabled) {
			recaptchaReady = true;
			return;
		}

		// Check if reCAPTCHA is already loaded
		if (checkRecaptchaReady()) {
			globalThis.grecaptcha.ready(() => {
				recaptchaReady = true;
			});
		} else {
			// Wait for the script to load
			const checkInterval = setInterval(() => {
				if (checkRecaptchaReady()) {
					globalThis.grecaptcha.ready(() => {
						recaptchaReady = true;
					});
					clearInterval(checkInterval);
				}
			}, 100);

			// Cleanup after 10 seconds
			setTimeout(() => {
				clearInterval(checkInterval);
				if (!recaptchaReady) {
					console.warn('reCAPTCHA failed to load within 10 seconds');
					// Allow form to work without reCAPTCHA if it fails to load
					recaptchaReady = true;
				}
			}, 10000);
		}
	});

	const animateWait = async ({ formData }: any) => {
		loading = true;

		return async ({ update }: any) => {
			loading = false;
			await update();
		};
	};
</script>

<svelte:head>
	<title>Contact</title>
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	<meta name="description" content="Contactez-moi" />
	{#if isRecaptchaEnabled}
		<script src="https://www.google.com/recaptcha/api.js?render={PUBLIC_RECAPTCHA_SITE_KEY}" async defer></script>
	{/if}
</svelte:head>

{#if !form?.success}
	{#if recaptchaReady || !isRecaptchaEnabled}
		<form
			method="POST"
			action="?/postContact"
			use:captchaEnhance={{
				type: 'recaptcha',
				sitekey: PUBLIC_RECAPTCHA_SITE_KEY,
				action: 'contact_form',
				submit: animateWait
			}}
			class="grid grid-cols-2 items-stretch gap-3"
		>
		<div>
			<label for="name">Nom :</label>
			<input
				class="input-bordered input w-full border-accent"
				type="text"
				name="name"
				placeholder="Jean Dupon"
				value={form?.data?.name ?? ''}
				class:border-red-600={form?.errors?.name ?? false}
			/>
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
				placeholder="prefixe@domaine.tld"
				value={form?.data?.email ?? ''}
				class:border-red-600={form?.errors?.email ?? false}
			/>
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
				value={form?.data?.subject ?? ''}
				class:border-red-600={form?.errors?.subject ?? false}
			/>
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
				value={form?.data?.message?.toString() ?? ''}
				class:border-red-600={form?.errors?.message ?? false}
			/>
			{#if form?.errors?.message ?? false}
				<p class="text-xs text-red-600">{form?.errors?.message[0]}</p>
			{/if}
		</div>
		<div class="col-span-2">
			{#if isRecaptchaEnabled}
				<div class="flex flex-col items-center space-y-2">
					<div class="text-center text-green-600 text-sm flex items-center">
						<svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
							<path
								fill-rule="evenodd"
								d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
								clip-rule="evenodd"
							></path>
						</svg>
						Protection anti-spam active
					</div>

					{#if form?.errors?.['g-recaptcha-response'] ?? false}
						<div class="bg-red-50 border border-red-200 rounded-md p-3 w-full max-w-md">
							<div class="flex items-center">
								<svg class="w-4 h-4 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
									<path
										fill-rule="evenodd"
										d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
										clip-rule="evenodd"
									></path>
								</svg>
								<p class="text-sm text-red-700">{form?.errors?.['g-recaptcha-response'][0]}</p>
							</div>
						</div>
					{/if}
				</div>
			{:else}
				<div
					class="text-center text-yellow-500 text-sm bg-yellow-50 border border-yellow-200 rounded-md p-3"
				>
					⚠️ reCAPTCHA non configuré - le formulaire fonctionnera sans validation anti-spam
				</div>
			{/if}
		</div>
		<button type="submit" aria-busy={loading} class="btn-primary btn col-span-2">
			{#if loading}
				<iconify-icon
					icon="icomoon-free:spinner2"
					width="24"
					height="24"
					class:animate-spin={loading}
				/>
			{:else}
				Envoyer
			{/if}
		</button>
	</form>
	{:else}
		<div class="text-center p-8">
			<div class="text-lg text-gray-600 mb-4">
				<svg class="inline w-6 h-6 animate-spin mr-2" viewBox="0 0 24 24" fill="none">
					<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
					<path class="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
				</svg>
				Chargement de la protection anti-spam...
			</div>
		</div>
	{/if}
{:else}
	<div class="text-center">
		<h1 class="text-5xl">Merci pour votre message</h1>
		<button
			class="btn-primary btn m-5"
			on:click={() => {
				if (form) {
					form.success = false;
				}
			}}>Retourner au formulaire</button
		>
	</div>
{/if}

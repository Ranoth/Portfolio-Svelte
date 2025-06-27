<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData, SubmitFunction } from './$types';
	import { onMount } from 'svelte';
	import { PUBLIC_RECAPTCHA_SITE_KEY } from '$env/static/public';

	export let form: ActionData;

	let loading = false;
	let recaptchaLoaded = false;

	const animateWait: SubmitFunction = async ({ formData }) => {
		loading = true;
		console.log('Form submission started');
		
		// Execute reCAPTCHA v3 if available
		if (PUBLIC_RECAPTCHA_SITE_KEY && recaptchaLoaded) {
			console.log('Executing reCAPTCHA...');
			const token = await executeRecaptcha();
			if (token) {
				console.log('reCAPTCHA token received, adding to form');
				formData.append('g-recaptcha-response', token);
			} else {
				console.error('Failed to get reCAPTCHA token');
			}
		} else {
			console.log('reCAPTCHA not available:', { 
				siteKey: !!PUBLIC_RECAPTCHA_SITE_KEY, 
				loaded: recaptchaLoaded 
			});
		}
		
		return async ({ update }) => {
			loading = false;
			await update();
		};
	};

	onMount(() => {
		// Only load reCAPTCHA if site key is available
		if (!PUBLIC_RECAPTCHA_SITE_KEY) {
			console.warn('reCAPTCHA site key not available - reCAPTCHA will be disabled');
			return;
		}

		console.log('Loading reCAPTCHA v3 with site key:', PUBLIC_RECAPTCHA_SITE_KEY);

		// Load reCAPTCHA v3 script
		if (!window.grecaptcha) {
			const script = document.createElement('script');
			script.src = `https://www.google.com/recaptcha/api.js?render=${PUBLIC_RECAPTCHA_SITE_KEY}`;
			script.async = true;
			script.defer = true;
			
			script.onload = () => {
				console.log('reCAPTCHA script loaded successfully');
				recaptchaLoaded = true;
			};
			
			script.onerror = (error) => {
				console.error('Failed to load reCAPTCHA script:', error);
			};
			
			document.head.appendChild(script);
		} else {
			console.log('reCAPTCHA already loaded');
			recaptchaLoaded = true;
		}
	});

	async function executeRecaptcha(): Promise<string | null> {
		if (!window.grecaptcha || !recaptchaLoaded || !PUBLIC_RECAPTCHA_SITE_KEY) {
			console.error('reCAPTCHA not ready:', {
				grecaptcha: !!window.grecaptcha,
				loaded: recaptchaLoaded,
				siteKey: !!PUBLIC_RECAPTCHA_SITE_KEY
			});
			return null;
		}
		
		try {
			console.log('Executing reCAPTCHA with site key:', PUBLIC_RECAPTCHA_SITE_KEY);
			const token = await window.grecaptcha.execute(PUBLIC_RECAPTCHA_SITE_KEY, {
				action: 'contact_form'
			});
			console.log('reCAPTCHA execution successful, token length:', token?.length || 0);
			return token;
		} catch (error) {
			console.error('reCAPTCHA execution failed:', error);
			return null;
		}
	}
</script>

<svelte:head>
	<title>Contact</title>
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	<meta name="description" content="Contactez-moi" />
</svelte:head>

{#if !form?.success}
	<form
		method="POST"
		action="?/postContact"
		use:enhance={animateWait}
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
		</div>		<div class="col-span-2">
			{#if PUBLIC_RECAPTCHA_SITE_KEY}
				<div class="flex flex-col items-center space-y-2">
					{#if !recaptchaLoaded}
						<div class="text-center text-gray-500 text-sm flex items-center">
							<div class="loading loading-spinner loading-sm mr-2"></div>
							Chargement de la protection anti-spam...
						</div>
					{:else}
						<div class="text-center text-green-600 text-sm flex items-center">
							<svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
								<path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
							</svg>
							Protection anti-spam active
						</div>
					{/if}
					
					{#if form?.errors?.['g-recaptcha-response'] ?? false}
						<div class="bg-red-50 border border-red-200 rounded-md p-3 w-full max-w-md">
							<div class="flex items-center">
								<svg class="w-4 h-4 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
									<path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
								</svg>
								<p class="text-sm text-red-700">{form?.errors?.['g-recaptcha-response'][0]}</p>
							</div>
						</div>
					{/if}
				</div>
			{:else}
				<div class="text-center text-yellow-500 text-sm bg-yellow-50 border border-yellow-200 rounded-md p-3">
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

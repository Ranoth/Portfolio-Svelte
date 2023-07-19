<script>
    import { page } from "$app/stores";
</script>

<svelte:head>
	<title>{$page.url.pathname} - Error</title>
	<meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="description" content="Page d'erreur: {$page.status}">
</svelte:head>

<h1>Erreur {$page.status}: {$page.error?.message ?? "Undefined error"}</h1>
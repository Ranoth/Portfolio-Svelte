<script lang="ts">
	import "../app.css";
	import "iconify-icon";
	import Nav from "$lib/components/Nav.svelte";
	import Footer from "$lib/components/Footer.svelte";
	import { fly } from "svelte/transition";

	export let data;
</script>

<Nav />

<main class="container mx-auto overflow-hidden p-5">
	{#key data.url}
		<div
			in:fly={{ y: -500, duration: 200, delay: 200 }}
			out:fly={{ duration: 200 }}>
			<slot />
		</div>
	{/key}
</main>

<Footer />

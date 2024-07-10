<script lang="ts">
	import { page } from '$app/stores';
	export let href: string;
	export let text: string;
</script>

<li>
	<a
		href="/{href}"
		class="no-animation btn translate-y-2.5 border-2 [.btn&]:border-primary [.btn&]:text-white xl:btn-wide"
		class:btn-primary={$page.url.pathname !== `/${href}`}
		class:transform-none={$page.url.pathname !== `/${href}`}
		class:border-b-0={$page.url.pathname === `/${href}`}
		class:rounded-b-none={$page.url.pathname === `/${href}`}
		class:[.btn&]:bg-base-100={$page.url.pathname === `/${href}`}
		class:btn-disabled={$page.url.pathname === `/${href}`}>{text}</a
	>
</li>

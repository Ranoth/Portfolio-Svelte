<script lang="ts">
	import { page } from "$app/stores";

	let swapIsActive: boolean = false;

	function swapActive() {
		document.getElementById("dropdown-button")!.classList.toggle("swap-active");
		swapIsActive = !swapIsActive;
	}
</script>

<nav
	class="navbar border-b-2 border-primary bg-gradient-to-r from-indigo-600 to-accent">
	<div class="navbar-start">
		<div class="dropdown" id="dropdown-menu">
			<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
			<label
				class="swap btn-ghost btn sm:hidden"
				on:focus={() => swapActive()}
				on:blur={() => swapActive()}
				id="dropdown-button"
				for="dropdown-menu"
				tabindex="0">
				<iconify-icon
					icon="cil:hamburger-menu"
					width="24"
					height="24"
					class="swap-off" />
				<iconify-icon
					icon="mdi:hamburger-menu-back"
					width="24"
					height="24"
					class="swap-on" />
			</label>
			<ul
				class="dropdown-content menu rounded-box w-56 border border-primary bg-base-200">
				<li>
					<a href="/" class:bg-primary={$page.url.pathname === "/"}>Qui suis-je</a>
				</li>
				<!-- <li>
					<a href="/about" class:bg-primary={$page.url.pathname === "/about"}
						>About</a>
				</li> -->
				<li>
					<a
						href="/projets"
						class:bg-primary={$page.url.pathname === "/projets"}>Projets</a>
				</li>
				<li>
					<a
						href="/contact"
						class:bg-primary={$page.url.pathname === "/contact"}>Contact</a>
				</li>
			</ul>
		</div>
		<a
			href="/"
			class="btn-ghost btn text-xl normal-case text-accent brightness-150 drop-shadow"
			>Portfolio</a>
	</div>
	<div class="navbar-center hidden sm:flex" id="center menu">
		<ul class="tabs z-20 justify-between gap-3 px-1">
			<li>
				<a
					href="/"
					class="no-animation btn translate-y-2.5 border-2 border-primary text-white xl:btn-wide"
					class:btn-primary={$page.url.pathname !== "/"}
					class:transform-none={$page.url.pathname !== "/"}
					class:border-b-0={$page.url.pathname === "/"}
					class:rounded-b-none={$page.url.pathname === "/"}
					class:bg-base-100={$page.url.pathname === "/"}
					class:btn-disabled={$page.url.pathname === "/"}>Qui suis-je</a>
			</li>
			<!-- <li>
				<a
					href="/about"
					class="no-animation btn translate-y-2.5 border-2 border-primary text-white xl:btn-wide"
					class:btn-primary={$page.url.pathname !== "/about"}
					class:transform-none={$page.url.pathname !== "/about"}
					class:border-b-0={$page.url.pathname === "/about"}
					class:rounded-b-none={$page.url.pathname === "/about"}
					class:bg-base-100={$page.url.pathname === "/about"}
					class:btn-disabled={$page.url.pathname === "/about"}>About</a>
			</li> -->
			<li>
				<a
					href="/projets"
					class="no-animation btn translate-y-2.5 border-2 border-primary text-white xl:btn-wide"
					class:btn-primary={$page.url.pathname !== "/projets"}
					class:transform-none={$page.url.pathname !== "/projets"}
					class:border-b-0={$page.url.pathname === "/projets"}
					class:rounded-b-none={$page.url.pathname === "/projets"}
					class:bg-base-100={$page.url.pathname === "/projets"}
					class:btn-disabled={$page.url.pathname === "/projets"}>Projets</a>
			</li>
			<li>
				<a
					href="/contact"
					class="no-animation btn translate-y-2.5 border-2 border-primary text-white xl:btn-wide"
					class:btn-primary={$page.url.pathname !== "/contact"}
					class:transform-none={$page.url.pathname !== "/contact"}
					class:border-b-0={$page.url.pathname === "/contact"}
					class:rounded-b-none={$page.url.pathname === "/contact"}
					class:bg-base-100={$page.url.pathname === "/contact"}
					class:btn-disabled={$page.url.pathname === "/contact"}>Contact</a>
			</li>
		</ul>
	</div>
	<div class="navbar-end">
		<a
			href="/"
			class="btn-ghost btn hidden text-xl normal-case text-indigo-600 drop-shadow sm:flex"
			>Léo Buhot</a>
	</div>
</nav>

<script>
	import RepoCard from "$lib/components/RepoCard.svelte";
	import { gitRepos } from "$lib/stores/gitReposStore";
</script>

<svelte:head>
	<title>Projets</title>
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	<meta name="description" content="Mes projets sur GitHub">
</svelte:head>

{#await $gitRepos}
	<h1>Chargement...</h1>
{:then $gitRepos}
	<div
		class="card-compact grid grid-flow-row gap-y-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
		{#each $gitRepos as repo}
			<RepoCard repo={repo}/>
		{/each}
	</div>
{/await}

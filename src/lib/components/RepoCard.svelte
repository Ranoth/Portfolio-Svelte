<script lang="ts">
	import type { Repository } from "$lib/types/gitRepo";

	export let repo: Repository;
</script>

<article
	class="container card ml-5 mr-5 h-auto w-auto rounded-xl border border-accent bg-base-300 shadow-xl even:bg-base-100">
	<div class="card-body">
		<h3 class="link-hover link-primary card-title text-2xl">
			<a href={repo.html_url} target="_blank">
				{repo.name}
			</a>
		</h3>
		<p class="text-base">{repo.description}</p>
		<div
			class="card-action -mb-4 -ml-4 -mr-4 grid grid-flow-col-dense grid-rows-1 justify-start rounded-xl border-t border-accent bg-gray-800 pb-4 pl-2 pt-4 sm:gap-5 md:gap-5 lg:gap-5 gap-5">
			<div>
				<iconify-icon
					icon="icon-park-outline:code-brackets"
					class="mr-2 ml-5 scale-150"
					inline />{repo.language}
			</div>
			<div>
				<iconify-icon
					icon="mdi:star"
					class="mr-1 scale-150"
					inline />
				{repo.stargazers_count}
			</div>
			<div>
				<iconify-icon
					icon="teenyicons:git-fork-outline"
					class="mr-1 scale-150"
					inline />
				{repo.forks_count}
			</div>
		</div>
	</div>
</article>

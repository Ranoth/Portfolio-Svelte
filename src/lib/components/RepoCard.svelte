<script lang="ts">
	import type { Repository } from '$lib/types/gitRepo';

	export let repo: Repository;
</script>

<article
	class="container card ml-5 mr-5 h-auto w-auto rounded-xl border border-accent bg-base-300 shadow-xl even:bg-base-100 relative"
>
	<div class="card-body">
		<h3 class="link-hover link-primary card-title text-2xl">
			<a href="{repo.html_url}#readme" target="_blank">
				{repo.name}
			</a>
		</h3>
		<p class="text-base">{repo.description}</p>
		<div
			class="card-action justify-start -mb-4 -ml-4 -mr-4 grid grid-flow-col-dense rounded-xl border-t border-accent bg-gray-800 pl-4 pr-4 pb-4 pt-3 sm:gap-5 md:gap-5 lg:gap-5 gap-5"
		>
			<div class="">
				<iconify-icon
					icon="icon-park-outline:code-brackets"
					class="mr-2 scale-125"
					inline
				/>{repo.language}
			</div>
			<div class="">
				<iconify-icon icon="mdi:star" class="mr-1 scale-125" inline />
				{repo.stargazers_count}
			</div>
			<div class="">
				<iconify-icon icon="teenyicons:git-fork-outline" class="mr-1 scale-125" inline />
				{repo.forks_count}
			</div>
		</div>
		<div class="absolute bottom-0 -right-2 z-0">
			<a href="{repo.html_url}#readme" target="_blank">
				<button class="btn btn-primary scale-75 uppercase">Repository</button>
			</a>
		</div>
	</div>
</article>

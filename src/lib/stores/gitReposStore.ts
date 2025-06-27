// import { PUBLIC_GITHUB_API_URL, PUBLIC_GITHUB_USERNAME } from "$env/static/public";
import type { Repository } from "$lib/types/gitRepo";
import { writable } from "svelte/store";

export const gitRepos = writable<Repository[]>([]);

export const fetchRepos = async () => {
	const res = await fetch(
		`${process.env.PUBLIC_GITHUB_API_URL}/users/${process.env.PUBLIC_GITHUB_USERNAME}/repos`
	);

	const data = await res.json();
	let repos: Repository[] = [];

	try {
		repos = data
			.map((repo: Repository) => {
				return {
					name: repo.name,
					description: repo.description,
					html_url: repo.html_url,
					language: repo.language,
					stargazers_count: repo.stargazers_count,
					forks_count: repo.forks_count,
					fork: repo.fork,
				};
			})
			.filter((repo: Repository) => !repo.fork);
	} catch (error: any) {
		console.error(error);
	}

	gitRepos.set(repos);
};

fetchRepos();
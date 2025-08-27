#!/usr/bin/env bash

function main() {
	next_version="v$(jq -r '.version' package.json)"
	current_version="$(svu current)"
	if [[ $current_version == $next_version ]]; then
		echo "Current version is the same as the next version"
		exit 1
	fi

	bun run version-bump.mjs
	bun run format:fix
	git add manifest.json versions.json package.json
	git commit -m "ci(root): Change to version $next_version"
	git tag $next_version
	git push --tags
}

main

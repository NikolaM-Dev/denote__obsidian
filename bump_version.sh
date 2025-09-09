#!/usr/bin/env bash

function main() {
	current_version=$(svu current)
	next_version=$(svu next)

	if [[ $current_version == $next_version ]]; then
		echo "Current version is the same as the next version"
		exit 1
	fi

	package_json_current_version=${current_version/v/}
	package_json_next_version=${next_version/v/}
	sed -i "s/$package_json_current_version/$package_json_next_version/" ./package.json
	bun run version-bump.mjs
	bun run format:fix
	git add manifest.json versions.json package.json
	git commit -m "ci(root): Change to version $next_version"
	git tag $next_version
	git push origin HEAD --tags
}

main

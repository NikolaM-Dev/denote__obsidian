#!/usr/bin/env bash

function main() {
	# Get the current and next version using [svu](https://github.com/caarlos0/svu/tree/main)
	current_version=$(svu current)
	next_version=$(svu next)

	# Validate if the current and next version at the same
	if [[ $current_version == $next_version ]]; then
		echo " [WARN] No new version detected. Please verify this is the expected behavior."
		exit 0
	fi

	# Update `package.json` with the next version
	echo " [DEBUG] Updating $(package.json) with the next version"
	package_json_current_version=${current_version/v/}
	package_json_next_version=${next_version/v/}
	sed -i "s/$package_json_current_version/$package_json_next_version/" ./package.json

	# Update Obsidian metadata files (`manifest.json` and `versions.json`)
	echo " [DEBUG] Updating Obsidian metadata files"
	bun run version-bump.mjs

	# Format and fix the project
	echo " [DEBUG] Format and Fixing the project"
	bun run format:fix

	# Create the commit to indicate the change of version
	echo " [DEBUG] Creating a new commit with the version change"
	git add manifest.json versions.json package.json
	git commit -m "ci(root): Change to version $next_version"

	# Create the tag according to the next version and push to the `origin`
	echo " [DEBUG] Creating and pushing tag with the next version"
	git tag $next_version
	git push origin HEAD --tags

	echo " [INFO] Process ended succesfully 💅✨"
}

main

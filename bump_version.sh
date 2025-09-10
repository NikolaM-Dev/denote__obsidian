#!/usr/bin/env bash

# Exit immediately if a command exits with a non-zero status.
set -e
# The return value of a pipeline is the status of the last command to exit with a non-zero status,
# or zero if all commands in the pipeline exit successfully.
set -o pipefail

function main() {
	# Get the current and next version using [svu](https://github.com/caarlos0/svu/tree/main)
	current_version=$(svu current)
	next_version=$(svu next)

	# Validate if the current and next version at the same
	if [[ "$current_version" == "$next_version" ]]; then
		echo " [WARN] No new version detected. Please verify this is the expected behavior."
		exit 0
	fi

	# Ensure next_version is not empty
	if [[ -z "$next_version" ]]; then
		echo " [ERROR] Next version is empty. Cannot proceed."
		exit 1
	fi

	# Update `package.json` with the next version
	echo " [DEBUG] Updating package.json with the next version"
	package_json_current_version=${current_version/v/}
	package_json_next_version=${next_version/v/}
	# Using 'g' for global replacement to ensure all occurrences are replaced if any.
	# Using a different delimiter like '#' to avoid issues if '/' is in version strings.
	sed -i "s#$package_json_current_version#$package_json_next_version#g" ./package.json

	# Update Obsidian metadata files (`manifest.json` and `versions.json`)
	echo " [DEBUG] Updating Obsidian metadata files"
	bun run version-bump.mjs

	# Format and fix the project
	echo " [DEBUG] Formatting and Fixing the project"
	bun run format:fix

	# Create the commit to indicate the change of version
	echo " [DEBUG] Creating a new commit with the version change"
	git add manifest.json versions.json package.json
	# Check if there are changes to commit, otherwise git commit will fail
	if git diff --cached --exit-code; then
		echo " [INFO] No changes detected after version bump. Skipping commit."
	else
		git commit -m "ci(root): Change to version $next_version"
		echo " [DEBUG] Successfully created commit for $next_version."
	fi

	# Create the tag according to the next version and push to the `origin`
	echo " [DEBUG] Creating and pushing tag with the next version"
	# Check if tag already exists before creating
	if git rev-parse -q --verify "refs/tags/$next_version" >/dev/null; then
		echo " [WARN] Tag '$next_version' already exists. Skipping tag creation."
	else
		git tag "$next_version"
		echo " [DEBUG] Tag '$next_version' created locally."
	fi

	# Push all tags
	git push --tags
	echo " [DEBUG] Pushed HEAD and tags to origin."

	echo " [INFO] Process ended successfully 💅✨"
}

main

#!/usr/bin/env bash

function main() {
	bun run version-bump.mjs
	bun run format:fix
	git add manifest.json versions.json package.json
	git commit -m "build(root): Change to version $(jq -r '.version' package.json)"
}

main

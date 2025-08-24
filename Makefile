.PHONY: install, version

install:
	bun run build
	mkdir -p $(SECOND_BRAIN_PATH)/src/.obsidian/plugins/denote__obsidian
	cp main.js $(SECOND_BRAIN_PATH)/src/.obsidian/plugins/denote__obsidian
	cp manifest.json $(SECOND_BRAIN_PATH)/src/.obsidian/plugins/denote__obsidian

version:
	bun run version-bump.mjs
	bun run format:fix
	git add manifest.json versions.json package.json

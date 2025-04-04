.PHONY: all

all:
	bun run build
	mkdir -p $(SECOND_BRAIN_PATH)/.obsidian/plugins/denote-renamer
	cp main.js $(SECOND_BRAIN_PATH)/.obsidian/plugins/denote-renamer
	cp manifest.json $(SECOND_BRAIN_PATH)/.obsidian/plugins/denote-renamer

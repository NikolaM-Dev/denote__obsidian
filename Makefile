.PHONY: install

install:
	bun run build
	mkdir -p $(SECOND_BRAIN_PATH)/src/.obsidian/plugins/denote-renamer
	cp main.js $(SECOND_BRAIN_PATH)/src/.obsidian/plugins/denote-renamer
	cp manifest.json $(SECOND_BRAIN_PATH)/src/.obsidian/plugins/denote-renamer

.PHONY: install

install:
	bun run build
	mkdir -p $(SECOND_BRAIN_PATH)/src/.obsidian/plugins/denote__obsidian
	cp main.js $(SECOND_BRAIN_PATH)/src/.obsidian/plugins/denote__obsidian
	cp manifest.json $(SECOND_BRAIN_PATH)/src/.obsidian/plugins/denote__obsidian

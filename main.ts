import { App, getAllTags, Modal, Notice, Plugin, PluginSettingTab, Setting, TFile } from 'obsidian';

interface GoodsidianSettings {
	settingsCurrentlyReadingURL: string;
	settingsReadURL: string;
}

const DEFAULT_SETTINGS: GoodsidianSettings = {
	settingsCurrentlyReadingURL: 'default',
	settingsReadURL: 'default'
}

export default class Goodsidian extends Plugin {
	settings: GoodsidianSettings;

	async onload() {
		console.log('loading my test plugin');

		await this.loadSettings();


		// Add icon in sidebar
		this.addRibbonIcon('dice', 'Sample Plugin', () => {
			new Notice('This is a notice!');
		});

		// Write text in status bar
		this.addStatusBarItem().setText('Goodsidian yeah!');

		// Add a command in command palette (also hotkey-able)
		this.addCommand({
			id: 'open-sample-modal',
			name: 'Open Sample Modal',
			checkCallback: (checking: boolean) => {
				let leaf = this.app.workspace.activeLeaf;
				if (leaf) {
					if (!checking) {
						new SampleModal(this.app).open();
					}
					return true;
				}
				return false;
			}
		});

		// Fetch frontmatter by command pallete
		this.addCommand({
			id: 'fetch-frontmatter',
			name: 'Fetch frontmatter',
			checkCallback: (checking: boolean) => {
				let leaf = this.app.workspace.activeLeaf;
				if (leaf) {
					if (!checking) {
						const currentlyOpenFile: TFile = this.app.workspace.getActiveFile();
						if (currentlyOpenFile instanceof TFile) {
							
							// Set arrays and variables
							let tags = getAllTags(this.app.metadataCache.getFileCache(currentlyOpenFile))
							var patt = new RegExp("book");
							var booktag = false;
							
							// Set booktag variable to true or false depending if tags contain 'book'
							for (var i = 0; i < tags.length; i++) {
								patt.test(tags[i]);
								if (patt.test(tags[i])) {
									var booktag = true
								}
							}

							// Print depending on 'book' being present in note
							if (booktag) {
								console.log('Book tag present in note.');								
							} else {
								console.log('Book tag not present.');
							}
							
							// Print bookid
							console.log(this.app.metadataCache.getFileCache(currentlyOpenFile).frontmatter.bookid);
						}
					}
					return true;
				}
				return false;
			}
		});

		// Fetch Goodreads URL
		this.addCommand({
			id: 'fetch-rss',
			name: 'Fetch RSS',
			checkCallback: (checking: boolean) => {
				let leaf = this.app.workspace.activeLeaf;
				if (leaf) {
					if (!checking) {
						const currentlyOpenFile: TFile = this.app.workspace.getActiveFile();
						if (currentlyOpenFile instanceof TFile) {
							// Code to edit
							console.log('Hello World!')
						}
					}
					return true;
				}
				return false;
			}
		});


		this.addSettingTab(new SampleSettingTab(this.app, this));

		this.registerCodeMirror((cm: CodeMirror.Editor) => {
			console.log('codemirror', cm);
		});

		
		this.registerInterval(window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000));
	}

	onunload() {
		console.log('Goodsidian unloaded!');
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

class SampleModal extends Modal {
	constructor(app: App) {
		super(app);
	}

	onOpen() {
		let {contentEl} = this;
		contentEl.setText('Woah!');
	}

	onClose() {
		let {contentEl} = this;
		contentEl.empty();
	}
}

	class SampleSettingTab extends PluginSettingTab {
	plugin: Goodsidian;

	constructor(app: App, plugin: Goodsidian) {
		super(app, plugin);
		this.plugin = plugin;
	}

	// Settings for plugin
	display(): void {
		let {containerEl} = this;

		containerEl.empty();

		containerEl.createEl('h3', { text: 'Goodsidian Settings' });
		containerEl.createEl('p', { text: 'If you notice any issues, update to the latest version of Goodsidian and reload Obsidian.' });

		new Setting(containerEl)
			.setName('Currently-Reading URL')
			.setDesc('You can find the RSS feed at the bottom of your Goodreads shelf.')
			.addText(text => text
				.setPlaceholder('Currently-Reading RSS URL')
				.setValue(this.plugin.settings.settingsCurrentlyReadingURL)
				.onChange(async (value) => {
					console.log(`Changed currently-reading url to: ${value}`);
					this.plugin.settings.settingsCurrentlyReadingURL = value;
					var CurrentlyReadingURL = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Read URL')
			.setDesc('You can find the RSS feed at the bottom of your Goodreads shelf.')
			.addText(text => text
				.setPlaceholder('Read RSS URL')
				.setValue(this.plugin.settings.settingsReadURL)
				.onChange(async (value) => {
					console.log(`Changed currently-reading url to: ${value}`);
					this.plugin.settings.settingsReadURL = value;
					var ReadURL = value;
					await this.plugin.saveSettings();
				}));
	}

		
}
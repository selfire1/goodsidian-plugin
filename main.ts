import { App, getAllTags, parseFrontMatterEntry, Modal, Notice, Plugin, PluginSettingTab, Setting, TFile, MarkdownPostProcessorContext, MarkdownView, MetadataCache } from 'obsidian';

interface GoodsidianSettings {
	mySetting: string;
}

const DEFAULT_SETTINGS: GoodsidianSettings = {
	mySetting: 'default'
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
							
							// Get tags
							let tags = getAllTags(this.app.metadataCache.getFileCache(currentlyOpenFile))
							var patt = new RegExp("book");
							var booktag = false;
							
							// Print depending on if tag '#book' is in frontmatter
							for (var i = 0; i < tags.length; i++) {
								
								patt.test(tags[i]);

								if (patt.test(tags[i])) {
									var booktag = true
								}
							}

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

	display(): void {
		let {containerEl} = this;

		containerEl.empty();

		containerEl.createEl('h2', {text: 'Settings for my awesome plugin.'});

		// Settings for plugin
		new Setting(containerEl)
			.setName('Setting #1')
			.setDesc('It\'s a secret')
			.addText(text => text
				.setPlaceholder('Enter your secret')
				.setValue('')
				.onChange(async (value) => {
					console.log('Secret: ' + value);
					this.plugin.settings.mySetting = value;
					await this.plugin.saveSettings();
				}));
	}
}
'use babel';

import {CompositeDisposable} from 'atom';
import * as formatter from './util/formatter';
import {spawn} from './util/process';

export function activate() {
	this.subscriptions = new CompositeDisposable();

	formatter.register(this.subscriptions);
}

export function deactivate() {
	this.subscriptions.dispose();
}

export function provideSteelbrainLinter() {
	const lint = require('./providers/steelbrain-linter');

	return {
		name: 'Crystal', // steelbrain + Nuclide
		providerName: 'Crystal', // Nuclide
		grammarScopes: ['source.crystal'], // steelbrain + Nuclide
		scope: 'file', // steelbrain + Nuclude
		lintOnFly: false, // steelbrain + Nuclide
		disabledForNuclide: false, // Nuclide TODO: set to true when Nuclide's diagnostics provider is written
		allGrammarScopes: false, // Nuclide
		lint // steelbrain + Nuclide
	};
}

export function provideAutocomplete() {
	// Hold providers in array so we can use multiple sources.
	const providers = [];

	const crackerPath = atom.config.get('crystal.crackerPath');
	spawn(crackerPath).then((output) => {
		spawn(crackerPath, ['server', atom.project.getPaths()[0]]).then(() => {}, (output) => {
			console.error('Cracker Server Failed to Spawn!');
			console.debug(output);
		});
		providers.push(require('./providers/cracker-autocomplete'));
	}, () => {})

	return providers;
}

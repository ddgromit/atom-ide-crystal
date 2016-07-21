'use babel';

import lint from './providers/steelbrain-linter';
import CompilerDiagnosticsProvider from './providers/nuclide-diagnostics';

export function activate() {}

export function provideSteelbrainLinter() {
	return {
		name: 'Crystal', // steelbrain + Nuclide
		providerName: 'Crystal', // Nuclide
		grammarScopes: ['source.crystal'], // steelbrain + Nuclide
		scope: 'file', // steelbrain + Nuclude
		lintOnFly: false, // steelbrain + Nuclide
		disabledForNuclide: true, // Nuclide
		allGrammarScopes: false, // Nuclide
		lint // steelbrain + Nuclide
	};
}

export function provideNuclideDiagnostics() {
	return new CompilerDiagnosticsProvider();
}

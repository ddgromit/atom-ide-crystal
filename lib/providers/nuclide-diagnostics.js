'use babel';
/* @flow */

import {
  Range,
  TextEditor,
  IDisposable
} from 'atom';

import type {
  DiagnosticProviderUpdate,
  MessageUpdateCallback,
  MessageInvalidationCallback
} from '../../node_modules/nuclide/pkg/nuclide-diagnostics-base';

import {DiagnosticsProviderBase} from '../../node_modules/nuclide/pkg/nuclide-diagnostics-provider-base';

import {getBuildJSON} from '../util/compiler';

const PROVIDER_NAME = 'Crystal';

export default class CompilerDiagnosticsProvider {
	_providerBase: DiagnosticsProviderBase;

	constructor() {
		/**
		* Look here:
		* https://github.com/facebook/nuclide/blob/master/pkg/nuclide-diagnostics-provider-base/ for
		* a complete list of options.
		*/
		const baseOptions = {
			enableForAllGrammars: false,
			grammarScopes: ['source.crystal'],
			shouldRunOnTheFly: false,
			onTextEditorEvent: editor => this._sendDiagnostics(editor)
		};
		this._providerBase = new DiagnosticsProviderBase(baseOptions);
	}

	_sendDiagnostics(editor: TextEditor): void {
		const filePath = editor.getPath();
		// When a New file is created, it will be "untitled" and getPath() will return null.
		if (filePath === null) {
			return;
		}

		// this._providerBase.dispose();

		getBuildJSON(filePath).then(output => {
			let issues;
			try {
				issues = JSON.parse(output).map(issue => {
					return {
						scope: 'file',
						providerName: PROVIDER_NAME,
						type: 'Error',
						filePath: issue.file,
						text: issue.message,
						range: new Range([
							[issue.line - 1, issue.column - 1],
							[issue.line - 1, issue.column + issue.size - 1]
						])
					};
				});
			} catch (err) {
				console.log(err);
				issues = [];
			} finally {
				const diagnostics: DiagnosticProviderUpdate = {
					filePathToMessages: new Map([[filePath, issues]])
				};
				this._providerBase.publishMessageUpdate(diagnostics);
			}
		});
	}

	// Delegate to these DiagnosticsProviderBase methods to satisfy the DiagnosticProvider interface.
	// These manage event subscriptions. A consumer of a diagnostics provider will subscribe to these
	// events. The DiagnosticsProviderBase takes care of the details of event subscription.
	onMessageUpdate(callback: MessageUpdateCallback): IDisposable {
		return this._providerBase.onMessageUpdate(callback);
	}

	onMessageInvalidation(callback: MessageInvalidationCallback): IDisposable {
		return this._providerBase.onMessageInvalidation(callback);
	}
}

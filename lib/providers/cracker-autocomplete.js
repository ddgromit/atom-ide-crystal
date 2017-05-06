'use babel';

import {spawn} from '../util/process';

const crackerPath = atom.config.get('crystal.crackerPath');

export default {
	selector: '.source.crystal',
	inclusionPriority: 1,
  excludeLowerPriority: true,
	suggestionPriority: 2,
	getSuggestions: () => {
		return new Promise((resolve) => {

		});
	},
	dispose: () => {
		spawn(`${crackerPath} client --stop-server`);
	}
};

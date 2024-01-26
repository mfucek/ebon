import { buildTool } from './buildTool';

export const messages = {
	intro: 'create-ebon-dev',
	install: {
		ask: 'Install dependencies?',
		in_progress: 'Installing via ' + buildTool,
		completed: 'Installed via ' + buildTool
	},
	name: 'What will your project be named? asda sd',
	platform: 'Select a platform.',
	type: 'Pick a project type.',
	canceled: 'Operation cancelled.',
	tools: 'Select additional tools.',
	next_steps: 'Next steps.',
	recommendedWorkspace: 'Set up your workspace.'
};

import * as p from '@clack/prompts';
import color from 'picocolors';
import { installProject } from '../installer';
import { defaultName } from './constants';
import { buildTool } from './constants/buildTool';
import { contactUrl } from './constants/contactUrl';
import { messages } from './constants/messages';

export async function main() {
	console.clear();

	p.intro(`${color.bgCyan(color.black(` ${messages.intro} `))}`);

	const project = await p.group(
		{
			name: () =>
				p.text({
					message: messages.name,
					placeholder: defaultName,
					defaultValue: defaultName,
					validate: (value) => {
						if (value === '') {
							value = defaultName;
						}
						if (value.includes(' ')) {
							return 'No spaces allowed';
						}
						if (/[A-Z]/.test(value)) {
							return 'Please use lowercase letters only';
						}
						if (/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
							return 'Please use letters and numbers only';
						}
					}
				}),
			type: () =>
				p.select({
					message: messages.type,
					initialValue: 'ts',
					options: [
						{ value: 'ts', label: 'TypeScript' },
						{ value: 'js', label: 'JavaScript', hint: 'wrong choice' }
					]
				}),
			type_wrong: ({ results }) => {
				if (results.type === 'js') {
					p.note('Wrong choice. Using TypeScript.');
					results.type = 'ts';
				}
			},
			tools: () =>
				p.multiselect({
					message: messages.tools,
					required: false,
					options: [
						{ value: 'prettier', label: 'Prettier', hint: 'code formatting' },
						{ value: 'eslint', label: 'ESLint', hint: 'code linting' },
						{ value: 'tailwind', label: 'tailwind', hint: 'css styling' }
					]
				}),
			platforms: () =>
				p.multiselect({
					message: messages.platform,
					initialValues: ['web'],
					options: [
						{ value: 'web', label: 'Web', hint: 'browser', disabled: true },
						{ value: 'electron', label: 'Electron', hint: 'desktop' },
						{
							value: 'capacitor',
							label: 'Capacitor',
							hint: 'iOS & Android'
						}
					]
				}),
			install: () =>
				p.confirm({
					message: messages.install.ask,
					initialValue: true
				})
		},
		{
			onCancel: () => {
				p.cancel(messages.canceled);
				process.exit(0);
			}
		}
	);

	if (project.install) {
		const s = p.spinner();
		s.start(messages.install.in_progress);
		await installProject({ name: project.name });
		s.stop(messages.install.completed);
	}

	const nextSteps = [
		`cd ${project.name}`,
		...(project.install ? [] : [`${buildTool} install`]),
		`${buildTool} dev`
	].join('\n');

	p.note(nextSteps, messages.next_steps);

	p.outro(`Problems? ${color.underline(color.cyan(contactUrl))}`);
}

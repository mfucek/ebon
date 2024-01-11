import { mkdirSync } from 'fs';

const repoUrl = 'https://github.com/mfucek/ebon.git';

function sleep(ms: number) {
	return new Promise((resolve) => {
		setTimeout(resolve, ms);
	});
}

export const installProject = async (config: { name: string }) => {
	await sleep(2500);

	mkdirSync(config.name);

	return true;
};

import { cpSync } from 'fs';
import { fileURLToPath } from 'node:url';
import path from 'path';

const repoUrl = 'https://github.com/mfucek/ebon.git';

// @ts-ignore
const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory

const basePath = __dirname + '/../base';

function sleep(ms: number) {
	return new Promise((resolve) => {
		setTimeout(resolve, ms);
	});
}

export const installProject = async (config: { name: string }) => {
	// await sleep(2500);

	// mkdirSync(config.name);
	console.log(basePath);

	try {
		cpSync(basePath, config.name, {
			recursive: true
		});
	} catch (error) {
		console.log('Failed to copy files');
		console.log(error);
	}

	return true;
};

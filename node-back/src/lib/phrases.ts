import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';

const PHRASE_SRC_FILE_PATH = join(
	__dirname,
	'../../node-back/src/resources/frases.json'
);

const getRandomPhrase = async (): Promise<string> => {
	const frasesString = await readFile(PHRASE_SRC_FILE_PATH, {
		encoding: 'utf-8',
	});

	const { frases } = JSON.parse(frasesString);
	return frases[Math.floor(Math.random() * frases.length)];
};

const addPhrase = async (phrase: string): Promise<void> => {
	const frasesString = await readFile(PHRASE_SRC_FILE_PATH, {
		encoding: 'utf-8',
	});

	const frases = JSON.parse(frasesString);
	frases.frases.push(phrase);

	await writeFile(PHRASE_SRC_FILE_PATH, JSON.stringify(frases));
};

export { getRandomPhrase, addPhrase };

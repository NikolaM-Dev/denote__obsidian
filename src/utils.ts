import { App, TAbstractFile, TFile } from 'obsidian';
import { format } from '@formkit/tempo';

import { IFrontMatter, IFrontMatterProperty, ITags } from './models';

export function toKebabCase(payload: string): string {
	// Replace whitespace with hyphens
	let result = payload.replace(/\s+/g, '-');

	// Replace problematic symbols
	result = result.replace(/\//g, '-').replace(/\\/g, '-');

	// Remove any characters that are not alphanumeric or hyphens
	result = result.replace(/[^a-zA-Z0-9-]/g, '');

	// Convert to lowercase
	result = result.toLowerCase();

	// Remove leading/trailing hyphens
	result = result.replace(/^-+|-+$/g, '');

	// Replace multiple consecutive hyphens with a single hyphen
	result = result.replace(/-+/g, '-');

	return result;
}

export function testToKebabCase() {
	const testCases = [
		{
			payload: 'JUan DAvid',
			expected: 'juan-david',
		},
		{
			payload: 'What is Kebab case? | Definition from TheServerSide',
			expected: 'what-is-kebab-case-definition-from-theserverside',
		},
		{
			payload: 'How to Get Fluent 10x Faster (Stop Making This Mistake!)',
			expected: 'how-to-get-fluent-10x-faster-stop-making-this-mistake',
		},
		{
			payload: 'Language Islands: Talking about Yourself',
			expected: 'language-islands-talking-about-yourself',
		},
		{
			payload: 'Testest the path /home/nikola/w/ al amanecer',
			expected: 'testest-the-path-home-nikola-w-al-amanecer',
		},
		{
			payload: 'Testest the path \\home\\nikola\\w\\ al amanecer',
			expected: 'testest-the-path-home-nikola-w-al-amanecer',
		},
		{
			payload:
				"Are TED Talks Actually Good for Language Learning? (Polyglot's Honest Opinion)",
			expected:
				'are-ted-talks-actually-good-for-language-learning-polyglots-honest-opinion',
		},
	];

	testCases.forEach((testCase, i) => {
		const got = toKebabCase(testCase.payload);

		if (testCase.expected !== got) {
			console.error(
				`${i + 1} ❌ | Expected ${testCase.expected} and Got ${got}`,
			);

			return;
		}

		console.info(
			`${i + 1} ✅ | Expected ${testCase.expected} and Got ${got}`,
		);
	});
}

export function isTFile(value: TAbstractFile): value is TFile {
	return 'stat' in value;
}

export async function getFrontMatter(
	file: TFile,
	app: App,
): Promise<IFrontMatter> {
	let _frontMatter: IFrontMatter = {
		createdAt: null,
		id: null,
		tags: null,
		title: null,
		updatedAt: null,
	};

	await app.fileManager.processFrontMatter(
		file,
		async (frontMatter: IFrontMatter) => {
			if (Object.entries(frontMatter).length === 0) return;

			_frontMatter = frontMatter;
		},
	);

	return _frontMatter;
}

export function trim(payload: string): string {
	return payload.replace(/^\s+|\s+$/g, '').replace(/\s+/g, ' ');
}

function sortTags(tags: string[]): string[] {
	return tags.sort((a, b) => a.localeCompare(b));
}

export function sanatizeTags(tags: ITags): string[] {
	const fallbackTags = ['action/pending'];
	let verifiedTags = fallbackTags;

	switch (typeof tags) {
		case 'undefined':
			// Explicity setting verifiedTags to use fallbackTags
			verifiedTags = fallbackTags;
			break;

		case 'string':
			// Change one single tag to array format
			verifiedTags = [tags];
			break;

		case 'object':
			// When tags is null, just use fallbackTags
			if (tags === null) {
				verifiedTags = fallbackTags;
				break;
			}

			// Remove null tags
			if (Array.isArray(tags)) {
				verifiedTags = tags.filter((tag) => tag !== null);
			}

			// sanitaizedTags after filter is an empty array, use fallbackTags
			if (verifiedTags.length === 0) verifiedTags = fallbackTags;

			break;
	}

	const trimmedTags = verifiedTags.map((tag) => trim(tag));
	const sortedTags = sortTags(trimmedTags);

	return sortedTags;
}

export function sanatizeId(
	fileCreationTime: number,
	id: IFrontMatterProperty,
): string {
	const fallbackId = format(new Date(fileCreationTime), 'YYYYMMDDThhmmss');
	let sanatizedId = 'INVALID';

	switch (typeof id) {
		// If string, this means that id already exits, just skip
		case 'string':
			sanatizedId = trim(id);
			break;

		// In any other case use fallbackId
		default:
			sanatizedId = fallbackId;
	}

	if (sanatizedId === 'INVALID')
		throw new Error("Id wasn't sanatize properly");

	return sanatizedId;
}

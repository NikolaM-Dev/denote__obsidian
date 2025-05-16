import { App, TAbstractFile, TFile } from 'obsidian';
import { format } from '@formkit/tempo';

import {
	IFrontMatter,
	IFrontMatterProperty,
	ISanitizedFrontMatter,
	ITags,
} from './models';

const INVALID = 'INVALID';

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

export async function getSanitizedFrontMatter(
	file: TFile,
	app: App,
): Promise<ISanitizedFrontMatter> {
	const frontMatter = (await getFrontMatter(
		file,
		app,
	)) as ISanitizedFrontMatter;

	return frontMatter;
}

export function trim(payload: string): string {
	return payload.replace(/^\s+|\s+$/g, '').replace(/\s+/g, ' ');
}

function sortTags(tags: string[]): string[] {
	return tags.sort((a, b) => a.localeCompare(b));
}

export function sanitizeTags(tags: ITags): string[] {
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

export function sanitizeId(
	id: IFrontMatterProperty,
	fileCreationTime: number,
): string {
	const fallbackId = format(new Date(fileCreationTime), 'YYYYMMDDThhmmss');
	let verifiedId = INVALID;

	switch (typeof id) {
		// If string, this means that id already exits, just skip
		case 'string':
			verifiedId = trim(id);
			break;

		// In any other case use fallbackId
		default:
			verifiedId = fallbackId;
	}

	if (verifiedId === INVALID)
		throw new Error("FRONTMATTER: id property wasn't sanitized properly");

	return verifiedId;
}

export function toTitleCase(title: string): string {
	const formattedTitle = trim(title).toLowerCase();

	// Split the string into words
	const words = formattedTitle.split(/\s+/);

	// Words to keep in lowercase (you can expand this list)
	const lowercaseWords = [
		'a',
		'an',
		'and',
		'as',
		'at',
		'but',
		'by',
		'en',
		'for',
		'from',
		'if',
		'in',
		'nor',
		'of',
		'on',
		'or',
		'per',
		'the',
		'to',
	];

	// Capitalize the first word and other words not in the lowercase list
	for (let i = 0; i < words.length; i++) {
		if (i === 0 || !lowercaseWords.includes(words[i])) {
			words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1);
		}
	}

	// Join the words back together
	return words.join(' ');
}

export function sanitizeTitle(title: IFrontMatterProperty): string {
	const fallbackTitle = 'Untitled';
	let verifiedTitle = fallbackTitle;

	switch (typeof title) {
		// If string, this means that id already exits and verifies format
		case 'string':
			verifiedTitle = toTitleCase(title);
			break;

		// In any other case use fallbackTitle
		default:
			verifiedTitle = fallbackTitle;
	}

	return verifiedTitle;
}

export function sanitizeTimeStamp(timestamp: number): string {
	return format(new Date(timestamp), 'YYYY-MM-DD, hh:mm:ss');
}

export function sanitizeCreatedAt(
	createdAt: IFrontMatterProperty,
	timestamp: number,
): string {
	const timestampFormat = 'YYYY-MM-DD, hh:mm:ss';
	const fallback = format(new Date(timestamp), timestampFormat);

	// If createdAt doesn't exists use fallback
	if (typeof createdAt !== 'string') return fallback;

	// If createdAt has an invalid format use fallback
	if (createdAt.length !== timestampFormat.length) return fallback;

	// Otherwise use current createdAt
	return createdAt;
}

export function getNewFilename(
	frontMatter: ISanitizedFrontMatter,
	fileExtension: string,
): string {
	const formattedFilename = toKebabCase(frontMatter.title);
	const formattedTags = getFormatTags(frontMatter.tags);

	return `${frontMatter.id}--${formattedFilename}${formattedTags}.${fileExtension}`;
}

export function getFormatTags(tags: string[]): string {
	const formattedTags = tags.map((tag) => toKebabCase(tag));

	return `__${formattedTags.join('_')}`;
}

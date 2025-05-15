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

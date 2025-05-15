export function toLowerKebabCase(payload: string): string {
	return payload
		.replace(/([a-z])([A-Z])/g, '$1-$2')
		.replace(/[\s_]+/g, '-')
		.replace(/\//g, '-')
		.toLowerCase();
}

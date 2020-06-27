export const sanitize = (original: string): string => {
	return original.replace(/[^a-zA-Z0-9_-]+/, "");
};

export const sanitizeOnlyDictionaryCharacters = (original: string): string => {
	return original.replace(/[^a-zA-Z0-9]+/, "");
};

export const sanitizeOnlyAscii = (original: string): string => {
	return original.replace(/[^!-~]+/, "");
};

export const getFromEnv = (key: string | undefined): string => {
	return process.env[key || ""] || "";
};

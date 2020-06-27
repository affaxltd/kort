import { Config, AuthProviderDictionary } from "../../../types/_config";
import c from "../../../config.json";
import validator from "validator";

const config = c as Config;

export const loadProviders = (): AuthProviderDictionary => {
	if (!config.auth_providers || !(config.auth_providers instanceof Array)) {
		console.log("auth_providers not configured in config.json");
		return {};
	} else {
		const providers: AuthProviderDictionary = {};

		config.auth_providers.forEach((provider) => {
			if (!provider.name || typeof provider.name !== "string")
				return console.log("Provider name not present or not a string");

			if (
				!provider.client_id_env ||
				typeof provider.client_id_env !== "string" ||
				!(provider.client_id_env in process.env)
			)
				return console.log(
					`Provider ${provider.name} client_id_env is not present, not a string or not found in the env`
				);

			if (
				!provider.secret_env ||
				typeof provider.secret_env !== "string" ||
				!(provider.secret_env in process.env)
			)
				return console.log(
					`Provider ${provider.name} secret_env is not present, not a string or not found in the env`
				);

			if (
				!provider.oauth_scope ||
				typeof provider.oauth_scope !== "string"
			)
				return console.log(
					`Provider ${provider.name} oauth_scope is not present or not a string`
				);

			if (!provider.oauth_uri || typeof provider.oauth_uri !== "string")
				return console.log(
					`Provider ${provider.name} oauth_uri is not present or not a string`
				);

			if (
				!provider.user_data_uri ||
				typeof provider.user_data_uri !== "string"
			)
				return console.log(
					`Provider ${provider.name} user_data_uri is not present or not a string`
				);

			if (
				!provider.email_json_path ||
				typeof provider.email_json_path !== "string"
			)
				return console.log(
					`Provider ${provider.name} email_json_path is not present or not a string`
				);

			if (!validator.isURL(provider.oauth_uri))
				return console.log(
					`Provider ${provider.name} oauth_uri is not an uri`
				);

			if (!validator.isURL(provider.user_data_uri))
				return console.log(
					`Provider ${provider.name} user_data_uri is not an uri`
				);

			providers[provider.name] = provider;

			console.log(`Provider ${provider.name} added`);
		});

		return providers;
	}
};

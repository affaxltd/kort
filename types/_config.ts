export interface Config {
	base_url?: string;
	base_url_dev?: string;
	auth_providers?: AuthProvider[];
}

export interface AuthProviderDictionary {
	[key: string]: AuthProvider;
}

export class AuthProvider {
	name?: string;
	oauth_scope?: string;
	client_id_env?: string;
	secret_env?: string;
	oauth_uri?: string;
	user_data_uri?: string;
	email_json_path?: string;
}

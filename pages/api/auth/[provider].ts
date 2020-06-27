import { NowRequest, NowResponse } from "@vercel/node";
import url from "url";
import validator from "validator";
import c from "../../../config.json";
import { Config } from "../../../types/_config";
import { getFromEnv } from "../tools/_env";
import { loadProviders } from "../tools/_providers";

const providers = loadProviders();
const config = c as Config;

const base_url = process.env.DEV ? config.base_url_dev : config.base_url;

export default async (req: NowRequest, res: NowResponse) => {
	const {
		query: { provider },
	} = req;

	if (typeof provider !== "string") {
		res.status(400).send("Bad request");
		return;
	}

	if (!base_url || typeof base_url !== "string") {
		res.status(500).send("Base url not configured in config.json");
		return;
	}

	if (!validator.isURL(base_url, { require_tld: false })) {
		res.status(500).send("Base url is not an url");
		return;
	}

	if (provider in providers) {
		const uri = url.parse(base_url);
		const prov = providers[provider];
		res.setHeader(
			"Location",
			`${url.resolve(prov.oauth_uri || "", "authorize")}?${[
				["client_id", getFromEnv(prov.client_id_env)],
				[
					"redirect_uri",
					`${uri.protocol || "https:"}//${
						uri.host
					}/api/auth/callback/${prov.name}`,
				],
				["scope", prov.oauth_scope],
				["state", process.env.STATE_SECRET || "secret"],
			]
				.map((s) => `${s[0]}=${s[1]}`)
				.join("&")}`
		);
		res.status(302).send("Redirecting...");
	} else {
		res.status(404).send("Not found");
	}
};

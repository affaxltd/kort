import { NowRequest, NowResponse } from "@vercel/node";
import url from "url";
import validator from "validator";
import c from "../../../config.json";
import { Config } from "../../../types/_config";
import { getFromEnv } from "../tools/_env";

const config = c as Config;
const base_url = process.env.DEV ? config.base_url_dev : config.base_url;

export default async (_req: NowRequest, res: NowResponse) => {
	if (!base_url || typeof base_url !== "string") {
		res.status(500).send("Base url not configured in config.json");
		return;
	}

	if (!validator.isURL(base_url, { require_tld: false })) {
		res.status(500).send("Base url is not an url");
		return;
	}

	const uri = url.parse(base_url);
	res.setHeader(
		"Location",
		`https://github.com/login/oauth/authorize?${[
			["client_id", getFromEnv("GITHUB_CLIENT_ID")],
			[
				"redirect_uri",
				`${uri.protocol || "https:"}//${uri.host}/api/oauth2/callback`,
			],
			["scope", "user"],
			["state", getFromEnv("STATE_SECRET")],
		]
			.map((s) => `${s[0]}=${s[1]}`)
			.join("&")}`
	);
	res.status(302).send("Redirecting...");
};

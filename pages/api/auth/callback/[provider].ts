import { NowRequest, NowResponse } from "@vercel/node";
import axios from "axios";
import url from "url";
import validator from "validator";
import c from "../../../../config.json";
import { Config } from "../../../../types/_config";
import { getFromEnv } from "../../tools/_env";
import { loadProviders } from "../../tools/_providers";
import { sanitize } from "../../tools/_sanitizer";
import { serialize, CookieSerializeOptions } from "cookie";
import { sign } from "jsonwebtoken";
import { ProviderTokenData } from "../../../../types/_provider";
import jp from "jsonpath";

const providers = loadProviders();
const config = c as Config;

const base_url = process.env.DEV ? config.base_url_dev : config.base_url;

export default async (req: NowRequest, res: NowResponse) => {
	const {
		query: { provider, code },
	} = req;

	if (!code || typeof code !== "string") {
		res.status(400).send("Bad request");
		return;
	}

	const sanitizedCode = sanitize(code);

	if (sanitizedCode === "") {
		res.status(400).send("Bad request");
		return;
	}

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
		try {
			const uri = url.parse(base_url);
			const prov = providers[provider];

			const accessTokenData = await axios.post<ProviderTokenData>(
				`${url.resolve(prov.oauth_uri || "", "access_token")}?${[
					["client_id", getFromEnv(prov.client_id_env)],
					["client_secret", getFromEnv(prov.secret_env)],
					["code", sanitizedCode],
					["state", process.env.STATE_SECRET || "secret"],
				]
					.map((s) => `${s[0]}=${s[1]}`)
					.join("&")}`,
				{},
				{
					headers: {
						Accept: "application/json",
					},
				}
			);

			const { access_token, token_type } = accessTokenData.data;

			const userData = await axios.get(prov.user_data_uri || "", {
				headers: {
					Authorization: `${token_type} ${access_token}`,
				},
			});

			const email = jp.value(
				userData.data,
				prov.email_json_path || "$..*[0].email"
			);

			if (email === undefined || email === null) {
				res.status(500).send("email_json_path doesn't return anything");
				return;
			}

			if (typeof email !== "string") {
				res.status(500).send(
					"email_json_path doesn't return a valid string"
				);
				return;
			}

			const domains = process.env.DOMAINS;
			const emails = process.env.EMAILS;

			if (!domains && !emails) {
				res.status(500).send(
					"Environment doesn't contain allowed domains or emails"
				);
				return;
			}

			if (
				!(
					(domains &&
						domains
							.toLowerCase()
							.split(",")
							.some(
								(domain) =>
									email
										.split("@")
										.reverse()[0]
										.toLowerCase() === domain
							)) ||
					(emails &&
						emails
							.toLowerCase()
							.split(",")
							.includes(email.toLowerCase()))
				)
			) {
				res.status(401).send("Unauthorized");
				return;
			}

			const cookieOptions: CookieSerializeOptions = {
				expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
				path: "/",
			};

			const userCookie = serialize(
				"user",
				sign(`${email}`, process.env.JWT_PASSCODE || "secret"),
				cookieOptions
			);

			res.setHeader("Set-Cookie", [userCookie]);
			res.setHeader(
				"Location",
				`${uri.protocol || "https:"}//${uri.host}/app/dashboard`
			);
			res.status(302).send("Redirecting...");
		} catch (e) {
			console.log(e);
			res.status(500).send(
				"Internal error, could be a problem in config.json. Please check the logs if you're the owner."
			);
		}
	} else {
		res.status(404).send("Not found");
	}
};

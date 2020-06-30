import { NowRequest, NowResponse } from "@vercel/node";
import axios from "axios";
import url from "url";
import validator from "validator";
import c from "../../../config.json";
import { Config } from "../../../types/_config";
import { getFromEnv } from "../tools/_env";
import { sanitize } from "../tools/_sanitizer";
import { serialize, CookieSerializeOptions } from "cookie";
import { sign } from "jsonwebtoken";
import jp from "jsonpath";
import { ProviderTokenData } from "../../../types/_provider";

const config = c as Config;

const base_url = process.env.DEV ? config.base_url_dev : config.base_url;

export default async (req: NowRequest, res: NowResponse) => {
	const {
		query: { code },
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

	if (!base_url || typeof base_url !== "string") {
		res.status(500).send("Base url not configured in config.json");
		return;
	}

	if (!validator.isURL(base_url, { require_tld: false })) {
		res.status(500).send("Base url is not an url");
		return;
	}

	try {
		const uri = url.parse(base_url);

		const accessTokenData = await axios.post<ProviderTokenData>(
			`https://github.com/login/oauth/access_token?${[
				["client_id", getFromEnv("GITHUB_CLIENT_ID")],
				["client_secret", getFromEnv("GITHUB_SECRET")],
				["code", sanitizedCode],
				["state", getFromEnv("STATE_SECRET")],
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

		const userData = await axios.get("https://api.github.com/user/emails", {
			headers: {
				Authorization: `${token_type} ${access_token}`,
			},
		});

		const email = jp.value(userData.data, "$[?(@.primary==true)].email");

		if (email === undefined || email === null) {
			res.status(500).send("Json path doesn't return anything");
			return;
		}

		if (typeof email !== "string") {
			res.status(500).send("Json path doesn't return a valid string");
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
								email.split("@").reverse()[0].toLowerCase() ===
								domain
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
};

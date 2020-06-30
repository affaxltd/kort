import { protect } from "./tools/_protect";
import { NowResponse } from "@vercel/node";
import { Request } from "../../types/_request";
import { connect } from "./tools/_mongodb";
import c from "../../config.json";
import { Config } from "../../types/_config";
import validator from "validator";
import url from "url";
import { paginate, calculateOffset } from "./tools/_pagination";

const config = c as Config;
const base_url = process.env.DEV ? config.base_url_dev : config.base_url;
const limit = 10;

export default protect(async (req: Request, res: NowResponse) => {
	const {
		query: { currentPage },
	} = req;

	if (!base_url || typeof base_url !== "string") {
		res.status(500).send("Base url not configured in config.json");
		return;
	}

	if (!validator.isURL(base_url, { require_tld: false })) {
		res.status(500).send("Base url is not an url");
		return;
	}

	if (currentPage instanceof Array) {
		res.status(400).send("Bad request");
		return;
	}

	const db = await connect();

	if (!db) {
		res.status(500).send("Internal error");
		return;
	}

	try {
		const collection = db.collection("links");
		const count = await collection.estimatedDocumentCount();
		const offset = calculateOffset(currentPage, limit);
		const results = await collection
			.find({})
			.sort({ created: -1 })
			.limit(limit)
			.skip(offset)
			.toArray();
		const uri = url.parse(base_url);
		const base = `${uri.protocol || "https:"}//${
			uri.host
		}/api/links?currentPage=`;
		const meta = paginate(currentPage, count, results, limit);
		res.status(200).json({
			results,
			count,
			next:
				meta.currentPage < meta.pageCount - 1
					? `${base}${meta.currentPage + 1}`
					: null,
			previous:
				meta.currentPage - 1 >= 0 &&
				meta.currentPage - 1 < meta.pageCount + 1
					? `${base}${meta.currentPage - 1}`
					: null,
		});
	} catch (error) {
		res.status(500).send("Internal error");
	}
});

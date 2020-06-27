import { NowRequest, NowResponse } from "@vercel/node";
import { connect } from "../tools/_mongodb";
import { sanitize } from "../tools/_sanitizer";

connect();

export default async (req: NowRequest, res: NowResponse) => {
	const redirect = async (url: string) => {
		res.setHeader("Location", url);
		res.status(302).send("Redirecting...");
	};

	try {
		const {
			query: { link },
		} = req;

		if (typeof link !== "string") {
			return redirect("/error/400");
		}

		const sanitizedLink = sanitize(link);

		if (sanitizedLink === "") {
			return redirect("/error/400");
		}

		const db = await connect();

		if (!db) {
			return redirect("/error/500");
		}

		const dbLink = await db
			.collection("links")
			.findOne({ slug: sanitizedLink });

		if (!dbLink || !dbLink.target) {
			return redirect("/error/404");
		} else {
			return redirect(dbLink.target);
		}
	} catch (e) {
		return redirect("/error/500");
	}
};

import { NowRequest, NowResponse } from "@vercel/node";
import { connect } from "../tools/_mongodb";
import { sanitize } from "../tools/_sanitizer";
import { Link } from "../../../types/_link";

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

		const dbLink: Link | null = await db
			.collection("links")
			.findOne({ slug: sanitizedLink });

		if (!dbLink || !dbLink.target) {
			return redirect("/error/404");
		} else {
			try {
				await db
					.collection("links")
					.findOneAndUpdate(
						{ slug: sanitizedLink },
						{ $inc: { clicks: 1 } }
					);
			} catch (e) {
				console.log(e);
			}

			return redirect(dbLink.target);
		}
	} catch (e) {
		return redirect("/error/500");
	}
};

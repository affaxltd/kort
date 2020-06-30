import { LinkBody, LinkMutationData } from "../../../../types/_link";
import { protect } from "../../tools/_protect";
import { Request } from "../../../../types/_request";
import { connect } from "../../tools/_mongodb";
import { NowResponse } from "@vercel/node";
import validator from "validator";
import { Db } from "mongodb";
import { sanitize, sanitizeOnlyAscii } from "../../tools/_sanitizer";

const validateBody = (
	func: (
		req: Request,
		res: NowResponse,
		body: LinkMutationData,
		db: Db
	) => Promise<void> | void,
	checks?: {
		checkForCurrentSlug?: boolean;
		checkForNewSlug?: boolean;
		checkForTarget?: boolean;
	}
): ((req: Request, res: NowResponse, db: Db) => Promise<void>) => {
	return async (req, res, db) => {
		const { body }: { body: LinkBody } = req;

		if (checks?.checkForCurrentSlug) {
			if (!body.currentSlug || typeof body.currentSlug !== "string") {
				res.status(400).send("Bad request");
				return;
			}

			body.currentSlug = sanitize(body.currentSlug);

			if (body.currentSlug === "") {
				res.status(400).send("Bad request");
				return;
			}
		}

		if (checks?.checkForNewSlug) {
			if (!body.newSlug || typeof body.newSlug !== "string") {
				res.status(400).send("Bad request");
				return;
			}

			body.newSlug = sanitize(body.newSlug);

			if (body.newSlug === "") {
				res.status(400).send("Bad request");
				return;
			}
		}

		if (checks?.checkForTarget) {
			if (!body.target || typeof body.target !== "string") {
				res.status(400).send("Bad request");
				return;
			}

			body.target = sanitizeOnlyAscii(body.target);

			if (!validator.isURL(body.target, { require_tld: false })) {
				res.status(400).send("Bad request");
				return;
			}
		}

		await func(
			req,
			res,
			{
				currentSlug: body.currentSlug || "",
				newSlug: body.newSlug || "",
				target: body.target || "",
			},
			db
		);
	};
};

const addLink = validateBody(
	async (_req, res, link, db) => {
		try {
			const collection = db.collection("links");

			const found = await collection.findOne({ slug: link.newSlug });

			if (found) {
				res.status(409).send("Link already found.");
				return;
			}

			const operation = await collection.insertOne({
				slug: link.newSlug,
				target: link.target,
				clicks: 0,
				created: Date.now(),
			});

			if (!operation.result.ok || operation.result.ok !== 1) {
				res.status(500).send("Internal error, please try again later.");
				return;
			}

			res.status(200).send("Ok");
		} catch (e) {
			res.status(500).send("Internal error, please try again later.");
		}
	},
	{
		checkForNewSlug: true,
		checkForTarget: true,
	}
);

const editLink = validateBody(
	async (_req, res, link, db) => {
		try {
			const collection = db.collection("links");

			if (link.newSlug !== link.currentSlug) {
				const found = await collection.findOne({ slug: link.newSlug });

				if (found) {
					res.status(409).send(
						"Link already found with the new slug"
					);
					return;
				}
			}

			const operation = await collection.findOneAndUpdate(
				{ slug: link.currentSlug },
				{ $set: { slug: link.newSlug, target: link.target } }
			);

			if (!operation.ok || operation.ok !== 1) {
				res.status(500).send("Internal error");
				return;
			}

			res.status(200).send("Ok");
		} catch (e) {
			console.log(e);
			res.status(500).send("Internal error");
		}
	},
	{
		checkForCurrentSlug: true,
		checkForNewSlug: true,
		checkForTarget: true,
	}
);

const deleteLink = validateBody(
	async (_req, res, link, db) => {
		try {
			const collection = db.collection("links");

			const found = await collection.findOne({ slug: link.currentSlug });

			if (!found) {
				res.status(404).send("Link not found");
				return;
			}

			const operation = await collection.findOneAndDelete({
				slug: link.currentSlug,
			});

			if (!operation.ok || operation.ok !== 1) {
				res.status(500).send("Internal error");
				return;
			}

			res.status(200).send("Ok");
		} catch (e) {
			res.status(500).send("Internal error");
		}
	},
	{
		checkForCurrentSlug: true,
	}
);

const deleteAll = async (req: Request, res: NowResponse, db: Db) => {
	try {
		const collection = db.collection("links");

		const { result } = await collection.deleteMany({});

		if (!result.ok || result.ok !== 1) {
			res.status(500).send("Internal error");
			return;
		}

		res.status(200).send("Ok");
	} catch (e) {
		res.status(500).send("Internal error");
	}
};

export default protect(async (req: Request, res: NowResponse) => {
	const {
		query: { action },
	} = req;

	if (typeof action !== "string") {
		res.status(400).send("Bad request");
		return;
	}

	const sanitizedAction = sanitize(action);

	if (sanitizedAction === "") {
		res.status(400).send("Bad request");
		return;
	}

	const connected = await connect();

	if (!connected) {
		res.status(500).send("Internal error");
		return;
	}

	const db = await connect();

	if (!db) {
		res.status(500).send("Internal error");
		return;
	}

	switch (sanitizedAction) {
		case "add": {
			await addLink(req, res, db);
			break;
		}
		case "update": {
			await editLink(req, res, db);
			break;
		}
		case "delete": {
			await deleteLink(req, res, db);
			break;
		}
		case "delete-all": {
			await deleteAll(req, res, db);
			break;
		}
		default: {
			res.status(405).send("Method not found");
			break;
		}
	}
});

import { NowRequest, NowResponse } from "@vercel/node";
import { Request } from "../../../types/_request";
import { UserToken } from "../../../types/_user";
import { verifyAsync } from "./_verify";

export const protect = (
	func: (req: Request, res: NowResponse) => Promise<void> | void
): ((req: NowRequest, res: NowResponse) => Promise<void>) => {
	return async (r, res) => {
		const req: Request = r;

		if (!("user" in req.cookies) || !("user" in req.cookies)) {
			res.status(401).send("Not authorized");
			return;
		}

		const token = req.cookies.user;

		if (!token || typeof token !== "string") {
			res.status(401).send("Not authorized");
			return;
		}

		const { authentic, decoded }: UserToken = await verifyAsync(token);

		if (!authentic) {
			res.status(401).send("Not authorized");
			return;
		}

		req.user = {
			loggedIn: true,
			email: decoded,
		};
		await func(req, res);
	};
};

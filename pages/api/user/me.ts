import { NowRequest, NowResponse } from "@vercel/node";
import { UserToken, WebUser } from "../../../types/_user";
import { verifyAsync } from "../tools/_verify";

export default async (req: NowRequest, res: NowResponse) => {
	const respond = (loggedIn: boolean, email: string = "") => {
		const userData: WebUser = {
			loggedIn,
			email,
		};
		res.status(200).json(userData);
	};

	if (!("user" in req.cookies) || !("user" in req.cookies)) {
		respond(false);
		return;
	}

	const token = req.cookies.user;

	if (!token || typeof token !== "string") {
		respond(false);
		return;
	}

	const { authentic, decoded }: UserToken = await verifyAsync(token);

	respond(authentic, authentic ? decoded : "");
};

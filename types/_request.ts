import { NowRequest } from "@vercel/node";
import { WebUser } from "./_user";

export type Request = NowRequest & {
	user?: WebUser;
};

import { Request } from "./_request";
import { NowResponse } from "@vercel/node";
import { Db } from "mongodb";

export type Link = {
	slug: string;
	target: string;
};

export type LinkBody = {
	currentSlug?: string;
	newSlug?: string;
	target?: string;
};

export interface LinkDictionary {
	[key: string]: Link;
}

export type LinkMutation = (
	req: Request,
	res: NowResponse,
	db: Db
) => Promise<void>;

export type LinkMutationData = {
	currentSlug: string;
	newSlug: string;
	target: string;
};

export type LinkMutationResponse = {
	ok: boolean;
	error?: string;
};

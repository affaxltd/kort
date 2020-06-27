import { LinkBody, LinkMutationResponse } from "../../types/_link";

export const requestLinkApi = async (
	body: LinkBody,
	method: string
): Promise<LinkMutationResponse> => {
	try {
		const location = window.location;

		const response = await fetch(
			`${location.protocol}//${location.host}/api/link/mutate/${method}`,
			{
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(body),
				method: "POST",
			}
		);

		if (response.status !== 200) {
			return {
				ok: false,
				error: await response.text(),
			};
		} else {
			return {
				ok: true,
			};
		}
	} catch (e) {
		console.log(e);
		return {
			ok: false,
			error: "An unknown error has occured",
		};
	}
};

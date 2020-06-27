import { verify } from "jsonwebtoken";

export const verifyAsync = async (
	token: string
): Promise<{ authentic: boolean; decoded: any }> => {
	return new Promise((resolve) => {
		verify(token, process.env.JWT_PASSCODE || "secret", (err, decoded) => {
			if (err) {
				resolve({
					authentic: false,
					decoded: {},
				});
			} else {
				resolve({
					authentic: true,
					decoded,
				});
			}
		});
	});
};

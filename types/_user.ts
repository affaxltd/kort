export type UserToken = {
	authentic: boolean;
	decoded: string;
};

export type WebUser = {
	loggedIn: boolean;
	email: string;
};

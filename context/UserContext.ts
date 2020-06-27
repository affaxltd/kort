import { createContext } from "react";
import { WebUser } from "../types/_user";

export type UserState = {
	user: WebUser;
	signIn?: (user: WebUser) => void;
	signOut?: () => void;
};

const initialData: UserState = {
	user: {
		loggedIn: false,
		email: "",
	},
};

const UserContext = createContext(initialData);

export default UserContext;

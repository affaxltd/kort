import { createContext, RefObject } from "react";
import Alert from "../components/primitives/Alert";

export type AlertState = {
	alert?: RefObject<Alert>;
};

const initialData: AlertState = {};

const AlertContext = createContext(initialData);

export default AlertContext;

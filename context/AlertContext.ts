import { createContext, RefObject } from "react";
import Alert from "../components/custom/Alert";

export type AlertState = {
	alertRef?: RefObject<Alert>;
};

const initialData: AlertState = {};

const AlertContext = createContext(initialData);

export default AlertContext;

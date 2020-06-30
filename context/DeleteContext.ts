import { createContext, RefObject } from "react";
import Delete from "../components/custom/Delete";

export type DeleteState = {
	deleteRef?: RefObject<Delete>;
};

const initialData: DeleteState = {};

const DeleteContext = createContext(initialData);

export default DeleteContext;

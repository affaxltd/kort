import { createContext, RefObject } from "react";
import Edit from "../components/custom/Edit";

export type EditState = {
	editRef?: RefObject<Edit>;
};

const initialData: EditState = {};

const EditContext = createContext(initialData);

export default EditContext;

import Button from "../primitives/Button";
import { Trash } from "react-feather";
import { useContext } from "react";
import DeleteContext from "../../context/DeleteContext";
import { requestLinkApi } from "../../lib/linkLib";
import AlertContext from "../../context/AlertContext";

const Housekeeping = () => {
	const { deleteRef } = useContext(DeleteContext);
	const { alertRef } = useContext(AlertContext);

	return (
		<div className="p-2">
			<Button
				color="red"
				text="Remove all links"
				Icon={Trash}
				onClick={() => {
					deleteRef?.current?.open(
						async () => {
							const { ok, error } = await requestLinkApi(
								{},
								"delete-all"
							);

							if (ok) {
								alertRef?.current?.open(
									"All links have been deleted.",
									"success"
								);
							} else {
								if (error)
									alertRef?.current?.open(error, "error");
							}
						},
						"all links",
						window.location.host,
						"links"
					);
				}}
			/>
		</div>
	);
};

export default Housekeeping;

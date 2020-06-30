import { useState, useContext, Fragment } from "react";
import Input from "../../components/primitives/Input";
import Button from "../../components/primitives/Button";
import { CSSTransition } from "react-transition-group";
import Spinner from "../../components/primitives/Spinner";
import validator from "validator";
import { requestLinkApi } from "../../lib/linkLib";
import AlertContext from "../../context/AlertContext";

const AddLink = ({ refresh }: { refresh: () => void }) => {
	const [slugText, setSlugState] = useState("");
	const [targetText, setTargetState] = useState("");
	const [slugErrorText, setSlugErrorTextState] = useState("");
	const [targetErrorText, setTargetErrorTextState] = useState("");
	const [adding, setAddingState] = useState(false);
	const [slugError, setSlugErrorState] = useState(false);
	const [targetError, setTargetErrorState] = useState(false);
	const { alertRef: alert } = useContext(AlertContext);

	const addLink = async () => {
		const slugIsValid = slugText !== "";
		const targetIsValid = targetText !== "";

		if (!slugIsValid || !targetIsValid) {
			if (!slugIsValid) {
				setSlugErrorState(true);
				setSlugErrorTextState("The slug can't be empty.");
			}

			if (!targetIsValid) {
				setTargetErrorState(true);
				setTargetErrorTextState("The target can't be empty.");
			}

			return;
		}

		if (!validator.isURL(targetText, { require_tld: false })) {
			setTargetErrorState(true);
			setTargetErrorTextState("The target must be an url.");
			return;
		}

		setAddingState(true);

		const response = await requestLinkApi(
			{
				newSlug: slugText,
				target: targetText,
			},
			"add"
		);

		if (response.ok) {
			setSlugState("");
			setTargetState("");
			refresh();

			alert?.current?.open("Added link to database.", "success");
		} else {
			if (response.error) {
				alert?.current?.open(response.error, "error");
			}
		}

		setAddingState(false);
	};

	return (
		<Fragment>
			<div className="flex items-start">
				<div className="text-left w-full p-4">
					<div className="sm:flex">
						<div className="flex w-full sm:mr-6">
							<Input
								name="Slug"
								value={slugText}
								setValueState={setSlugState}
								error={slugError}
								setErrorState={setSlugErrorState}
								errorText={slugErrorText}
								color="gray"
								placeholder="example"
								inline={true}
								validate={/^[0-9a-zA-Z_-]+$/}
							>
								<div className="rounded-md flex items-center pointer-events-none">
									<span className="text-gray-500">
										{window.location.host}/
									</span>
								</div>
							</Input>
						</div>
						<div className="mt-4 sm:mt-0 flex w-full">
							<Input
								name="Target"
								value={targetText}
								setValueState={setTargetState}
								error={targetError}
								setErrorState={setTargetErrorState}
								errorText={targetErrorText}
								color="gray"
								placeholder="https://example.com/"
								inline={false}
								validate={/^[!-~]+$/}
							/>
						</div>
					</div>
				</div>
			</div>
			<div className="bg-gray-50 p-4 sm:flex rounded-md">
				<div className="w-full sm:w-auto flex">
					<Button
						text="Add Link"
						color="green"
						disabled={adding}
						onClick={addLink}
					/>
					<CSSTransition
						mountOnEnter
						unmountOnExit
						timeout={200}
						classNames="general-transition"
						in={adding}
					>
						<div className="ml-4 flex-stretch flex flex-col justify-center">
							<Spinner color="gray-900" />
						</div>
					</CSSTransition>
				</div>
			</div>
		</Fragment>
	);
};

export default AddLink;

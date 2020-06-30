import { Component } from "react";
import { Tool } from "react-feather";
import Button from "../primitives/Button";
import Input from "../primitives/Input";
import Spinner from "../primitives/Spinner";
import { CSSTransition } from "react-transition-group";

type EditAction = (newSlug: string, target: string) => Promise<void>;

class Edit extends Component {
	state: {
		open: boolean;
		running: boolean;
		slugValue: string;
		targetValue: string;
		initialSlugValue: string;
		initialTargetValue: string;
		run?: EditAction;
	} = {
		open: false,
		running: false,
		slugValue: "",
		targetValue: "",
		initialSlugValue: "",
		initialTargetValue: "",
	};

	open(run: EditAction, currentSlug: string, target: string) {
		this.setState({
			open: true,
			running: false,
			slugValue: currentSlug,
			targetValue: target,
			initialSlugValue: currentSlug,
			initialTargetValue: target,
			run,
		});
	}

	render() {
		return (
			<CSSTransition
				mountOnEnter
				unmountOnExit
				timeout={200}
				classNames="general-transition"
				in={this.state.open}
			>
				<div className="fixed bottom-0 inset-x-0 px-4 pb-4 sm:inset-0 sm:flex sm:items-center sm:justify-center z-50">
					<div className="fixed inset-0 transition-opacity">
						<div className="absolute inset-0 bg-black opacity-75 blur"></div>
					</div>
					<div
						className="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full"
						role="dialog"
						aria-modal="true"
						aria-labelledby="modal-headline"
					>
						<div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
							<div className="sm:flex sm:items-start">
								<div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
									<Tool className="h-6 w-6 text-blue-600" />
								</div>
								<div className="mt-3 text-left sm:mt-0 sm:ml-4 w-full">
									<h3
										className="text-lg leading-6 font-medium text-gray-900 text-center sm:text-left"
										id="modal-headline"
									>
										Edit link
									</h3>
									<div className="mt-3 w-full">
										<Input
											color="gray"
											validate={/^[0-9a-zA-Z_-]+$/}
											name="Slug"
											small
											value={this.state.slugValue}
											setValueState={(val: string) => {
												this.setState({
													slugValue: val,
												});
											}}
										/>
									</div>
									<div className="mt-3 w-full">
										<Input
											color="gray"
											validate={/^[!-~]+$/}
											name="Target"
											small
											value={this.state.targetValue}
											setValueState={(val: string) => {
												this.setState({
													targetValue: val,
												});
											}}
										/>
									</div>
								</div>
							</div>
						</div>
						<div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
							<div className="flex w-full sm:ml-3 sm:w-auto">
								<span className="flex w-full rounded-md shadow-sm">
									<Button
										text="Save"
										color="dark"
										disabled={
											(this.state.slugValue ===
												this.state.initialSlugValue &&
												this.state.targetValue ===
													this.state
														.initialTargetValue) ||
											this.state.running
										}
										onClick={async () => {
											if (!this.state.open) return;

											this.setState({
												running: true,
											});

											if (this.state.run)
												await this.state.run(
													this.state.slugValue,
													this.state.targetValue
												);

											this.setState({
												running: false,
												open: false,
											});
										}}
									/>
									<CSSTransition
										mountOnEnter
										unmountOnExit
										timeout={200}
										classNames="general-transition"
										in={this.state.running}
									>
										<div className="flex flex-col justify-center ml-4 flex-stretch">
											<Spinner color="gray-900" />
										</div>
									</CSSTransition>
								</span>
							</div>
							<span className="mt-3 flex w-full rounded-md shadow-sm sm:mt-0 sm:w-auto">
								<Button
									text="Cancel"
									color="default"
									border
									onClick={() => {
										this.setState({
											open: false,
										});
									}}
								/>
							</span>
						</div>
					</div>
				</div>
			</CSSTransition>
		);
	}
}

export default Edit;

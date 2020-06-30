import { Component } from "react";
import { AlertTriangle } from "react-feather";
import Button from "../primitives/Button";
import Input from "../primitives/Input";
import Spinner from "../primitives/Spinner";
import { CSSTransition } from "react-transition-group";

type DeleteAction = () => Promise<void>;

class Delete extends Component {
	state: {
		open: boolean;
		running: boolean;
		inputValue: string;
		run?: DeleteAction;
		deleting?: string;
		required?: string;
		deleteType?: string;
	} = {
		open: false,
		running: false,
		inputValue: "",
	};

	open(
		run: DeleteAction,
		deleting: string,
		required: string,
		deleteType: string
	) {
		this.setState({
			open: true,
			running: false,
			inputValue: "",
			run,
			deleting,
			required,
			deleteType,
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
								<div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
									<AlertTriangle className="h-6 w-6 text-red-600" />
								</div>
								<div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
									<h3
										className="text-lg leading-6 font-medium text-gray-900"
										id="modal-headline"
									>
										Delete {this.state.deleteType}
									</h3>
									<div className="mt-2">
										<p className="text-sm leading-5 text-gray-500">
											Are you sure you want to delete{" "}
											<span className="text-black bg-red-100 px-1 py-0.5 rounded-md">
												{this.state.deleting}
											</span>
											? All the data assigned to the{" "}
											<span className="text-black bg-red-100 px-1 py-0.5 rounded-md">
												{this.state.deleteType}
											</span>{" "}
											will be removed. This action cannot
											be undone. To confirm this action,
											please type{" "}
											<span className="text-black bg-red-100 px-1 py-0.5 rounded-md">
												{this.state.required}
											</span>
											.
										</p>
									</div>
									<div className="mt-3">
										<Input
											color="gray"
											validate={/^[!-~]+$/}
											name="Slug"
											small
											hideName
											value={this.state.inputValue}
											setValueState={(val: string) => {
												this.setState({
													inputValue: val,
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
										text="Delete"
										color="red"
										disabled={
											this.state.inputValue !==
												this.state.required ||
											this.state.running
										}
										onClick={async () => {
											if (!this.state.open) return;

											this.setState({
												running: true,
											});

											if (this.state.run)
												await this.state.run();

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

export default Delete;

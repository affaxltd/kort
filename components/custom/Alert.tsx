import { Component } from "react";
import { CSSTransition } from "react-transition-group";
import c from "classnames";
import { Icon, Info, CheckCircle, XCircle, X } from "react-feather";

type AlertType = "info" | "success" | "error";

type AlertColor = {
	bg: string;
	text: string;
	icon: Icon;
};

const alertDictionary: {
	[key: string]: AlertColor;
} = {
	info: {
		bg: "bg-blue-100",
		text: "text-blue-500",
		icon: Info,
	},
	success: {
		bg: "bg-green-100",
		text: "text-green-500",
		icon: CheckCircle,
	},
	error: {
		bg: "bg-red-100",
		text: "text-red-500",
		icon: XCircle,
	},
};

class Alert extends Component {
	state: {
		open: boolean;
		text: string;
		alertType: AlertType;
		timeout?: NodeJS.Timeout;
	} = {
		open: false,
		text: "",
		alertType: "info",
	};

	get color(): AlertColor {
		return alertDictionary[this.state.alertType];
	}

	get bgColor(): string {
		return this.color.bg;
	}

	get textColor(): string {
		return this.color.text;
	}

	open(text: string, alertType: AlertType) {
		if (this.state.timeout) {
			clearTimeout(this.state.timeout);
		}

		const timeout = setTimeout(() => {
			this.setState({
				open: false,
				timeout: undefined,
			});
		}, 5000);

		this.setState({
			open: true,
			text,
			alertType,
			timeout,
		});
	}

	close() {
		if (this.state.timeout) {
			clearTimeout(this.state.timeout);
		}

		this.setState({
			open: false,
			timeout: undefined,
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
				<div className="fixed top-0 w-screen z-50 flex">
					<div
						className={c(
							"mt-16 rounded-md w-auto inline-block mx-auto",
							this.bgColor,
							this.textColor
						)}
					>
						<div className="py-3 px-4 flex">
							<div className="w-5 flex flex-col flex-stretch justify-center">
								<this.color.icon
									className={c("w-5 h-5", this.textColor)}
								/>
							</div>
							<div className="font-medium text-sm ml-2">
								{this.state.text}
							</div>
							<button
								className="w-5 ml-2 flex flex-col flex-stretch justify-center focus:outline-none focus:shadow-none"
								onClick={() => {
									this.close();
								}}
							>
								<X className={c("w-5 h-5", this.textColor)} />
							</button>
						</div>
					</div>
				</div>
			</CSSTransition>
		);
	}
}

export default Alert;

import React, { useState } from "react";
import c from "classnames";
import { CSSTransition } from "react-transition-group";

const Loader = ({
	isLoading,
	full,
	children,
}: {
	isLoading: boolean;
	full?: boolean;
	children: any;
}) => {
	const [viewContent, setContentState] = useState(false);
	const canSee = !isLoading && viewContent;

	return (
		<div>
			<CSSTransition
				in={canSee}
				timeout={500}
				classNames="loader-transition"
				mountOnEnter
			>
				{children}
			</CSSTransition>
			<CSSTransition
				in={isLoading}
				timeout={500}
				classNames="loader-transition"
				unmountOnExit
				onExiting={() => setContentState(true)}
			>
				<div id="loader" className={c({ full })}>
					<div className="loader triangle">
						<svg viewBox="0 0 86 80">
							<polygon points="43 8 79 72 7 72"></polygon>
						</svg>
					</div>
				</div>
			</CSSTransition>
		</div>
	);
};

export default Loader;

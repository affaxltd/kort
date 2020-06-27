import c from "classnames";

const Spinner = ({ color }: { color: string }) => {
	return (
		<svg className="spinner w-6 h-6" viewBox="0 0 50 50">
			<circle
				className={c("path stroke-current", `text-${color}`)}
				cx="25"
				cy="25"
				r="20"
				fill="none"
				strokeWidth="5"
			></circle>
		</svg>
	);
};

export default Spinner;

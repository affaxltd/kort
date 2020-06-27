import { Icon as IconComponent } from "react-feather";
import c from "classnames";

type ButtonColor = {
	normal: string;
	hover: string;
};

const colorTable: { [key: string]: ButtonColor } = {
	indigo: {
		normal: "bg-indigo-600",
		hover: "hover:bg-indigo-700",
	},
	green: {
		normal: "bg-green-400",
		hover: "hover:bg-green-500",
	},
	red: {
		normal: "bg-red-500",
		hover: "hover:bg-red-600",
	},
};

const Button = ({
	text,
	color,
	disabled,
	onClick,
	Icon,
}: {
	text?: string;
	color: string;
	disabled?: boolean;
	onClick?: () => void | Promise<void>;
	Icon?: IconComponent;
}) => {
	return (
		<span className="flex rounded-md shadow-sm w-full sm:w-auto">
			<button
				className={c(
					"flex rounded-md px-3 py-2 text-base font-medium shadow-sm justify-center sm:justify-start w-full sm:w-auto focus:outline-none focus:shadow-none",
					disabled ? "text-gray-800" : "text-white",
					disabled ? "bg-gray-200" : colorTable[color].normal,
					disabled ? "hover:bg-gray-200" : colorTable[color].hover
				)}
				onClick={() => {
					if (onClick) onClick();
				}}
			>
				{Icon && (
					<div className="mr-1.5 -ml-0.5 self-stretch flex flex-col justify-center">
						<div className="w-5 h-5">
							<Icon color="white" className="w-5 h-5" />
						</div>
					</div>
				)}
				{text && text}
			</button>
		</span>
	);
};

export default Button;

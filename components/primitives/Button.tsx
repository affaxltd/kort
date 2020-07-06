import { Icon as IconComponent } from "react-feather";
import c from "classnames";
import { RefObject } from "react";

type ButtonColor = {
	normal: string;
	hover: string;
	text: string;
};

const colorTable: { [key: string]: ButtonColor } = {
	indigo: {
		normal: "bg-indigo-600",
		hover: "hover:bg-indigo-700",
		text: "text-white",
	},
	green: {
		normal: "bg-green-400",
		hover: "hover:bg-green-500",
		text: "text-white",
	},
	red: {
		normal: "bg-red-600",
		hover: "hover:bg-red-700",
		text: "text-white",
	},
	default: {
		normal: "bg-white",
		hover: "hover:bg-gray-50",
		text: "text-gray-900",
	},
	dark: {
		normal: "bg-gray-800",
		hover: "hover:bg-gray-900",
		text: "text-white",
	},
};

const Button = ({
	text,
	color,
	border,
	disabled,
	onClick,
	buttonRef,
	Icon,
}: {
	text?: string;
	color: string;
	border?: boolean;
	disabled?: boolean;
	onClick?: () => void | Promise<void>;
	buttonRef?:
		| string
		| ((instance: HTMLElement | null) => void)
		| RefObject<HTMLElement>
		| null
		| undefined;
	Icon?: IconComponent;
}) => {
	return (
		<span
			className="flex rounded-md shadow-sm w-full sm:w-auto"
			ref={buttonRef}
		>
			<button
				className={c(
					"flex rounded-md px-3 py-2 text-base font-medium shadow-sm justify-center sm:justify-start w-full sm:w-auto focus:outline-none focus:shadow-none",
					disabled ? "text-gray-800" : colorTable[color].text,
					disabled ? "bg-gray-200" : colorTable[color].normal,
					disabled ? "hover:bg-gray-200" : colorTable[color].hover,
					border ? "border border-gray-200 border-solid" : null
				)}
				onClick={() => {
					if (disabled) return;
					if (onClick) onClick();
				}}
			>
				{Icon && (
					<div className="mr-1.5 -ml-0.5 self-stretch flex flex-col justify-center">
						<div className="w-4 h-4">
							<Icon color="white" className="w-4 h-4" />
						</div>
					</div>
				)}
				{text && text}
			</button>
		</span>
	);
};

export default Button;

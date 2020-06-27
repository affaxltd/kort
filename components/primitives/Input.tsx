import {
	useState,
	ChangeEvent,
	useRef,
	MutableRefObject,
	Dispatch,
	SetStateAction,
} from "react";
import c from "classnames";

type ValidateFunction = (val: string) => boolean;

const Input = ({
	name,
	value,
	setValueState,
	error,
	errorText,
	setErrorState,
	placeholder,
	color,
	validate,
	inline,
	children,
}: {
	name: string;
	value: string;
	setValueState: Dispatch<SetStateAction<string>>;
	error?: boolean;
	errorText?: string;
	setErrorState?: Dispatch<SetStateAction<boolean>>;
	placeholder: string;
	color: string;
	validate: RegExp | ValidateFunction;
	inline: boolean;
	children?: any;
}) => {
	const [focused, setFocusState] = useState(false);
	const inputRef: MutableRefObject<null | any> = useRef(null);

	const nameLower = name.toLowerCase();

	const check = (val: string) => {
		if (validate instanceof RegExp) {
			return validate.test(val);
		}
		if (validate as ValidateFunction) {
			return validate(val);
		}
		return false;
	};

	const onChange = (e: ChangeEvent<HTMLInputElement>) => {
		if (e.target.value === "" || check(e.target.value)) {
			setValueState(e.target.value);
		}
	};

	return (
		<div className="block w-full">
			<label
				htmlFor={nameLower}
				className="block text-base font-medium text-gray-700"
			>
				{name}
			</label>
			<div
				className="shadow rounded-md cursor-text"
				onClick={() => inputRef.current.focus()}
			>
				<div
					className={c(
						"mt-1 bg-white rounded-md w-full flex outline-none shadow-outline input-focused-normal",
						focused ? `input-focused-${color}` : "",
						error ? `input-focused-red` : ""
					)}
				>
					{inline && <div className="pl-3 py-2">{children}</div>}
					<input
						id={nameLower}
						name={nameLower}
						className={c(
							"py-2 rounded-md w-full focus:outline-none focus:shadow-none",
							{
								"px-3": !inline,
								"pr-3": inline,
								"ml-0.5": inline,
							}
						)}
						placeholder={placeholder}
						value={value}
						onChange={onChange}
						onFocus={() => {
							setFocusState(true);
							if (setErrorState) setErrorState(false);
						}}
						onBlur={() => setFocusState(false)}
						ref={inputRef}
					/>
				</div>
			</div>
			{error && (
				<div className="mt-1 text-red-500 text-sm font-medium">
					{errorText}
				</div>
			)}
		</div>
	);
};

export default Input;

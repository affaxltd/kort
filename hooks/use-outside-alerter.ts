import { MutableRefObject, useEffect } from "react";

export const useOutsideAlerter = (
	ref: MutableRefObject<null | any>,
	callback: () => void
) => {
	useEffect(() => {
		const handleClickOutside = (event: Event) => {
			if (ref.current !== null && !ref.current.contains(event.target)) {
				callback();
			}
		};

		document.addEventListener("mousedown", handleClickOutside);

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [ref]);
};

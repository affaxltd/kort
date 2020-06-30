import { RefObject, useState, useEffect } from "react";

const useOnScreen = (ref: RefObject<null | any>, rootMargin = "0px") => {
	const [isIntersecting, setIntersecting] = useState(false);

	useEffect(() => {
		const observer = new IntersectionObserver(
			([entry]) => setIntersecting(entry.isIntersecting),
			{ rootMargin }
		);

		if (ref.current) {
			observer.observe(ref.current);
		}
		return () => {
			observer.unobserve(ref.current);
		};
	}, []);

	return isIntersecting;
};

export default useOnScreen;

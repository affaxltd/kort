import { useContext, useState, useRef, useEffect } from "react";
import { MutableRefObject } from "react";
import UserContext from "../context/UserContext";
import Link from "next/link";
import { CSSTransition } from "react-transition-group";

const useOutsideAlerter = (
	ref: MutableRefObject<null | any>,
	callback: () => void
) => {
	useEffect(() => {
		function handleClickOutside(event: Event) {
			if (ref.current !== null && !ref.current.contains(event.target)) {
				callback();
			}
		}

		document.addEventListener("mousedown", handleClickOutside);

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [ref]);
};

const Header = () => {
	const { user, signOut } = useContext(UserContext);
	const [userDropdownOpen, setUserDropdownState] = useState(false);

	const wrapperRef = useRef(null);
	useOutsideAlerter(wrapperRef, () => setUserDropdownState(false));

	return (
		<nav className="bg-white w-screen absolute z-10">
			<div className="container px-5 mx-auto">
				<div className="relative flex items-center justify-between h-16">
					<div className="flex-1 flex sm:items-stretch sjustify-start">
						<div className="flex-shrink-0">
							<Link href="/app/dashboard">
								<svg
									className="block h-6 w-auto fill-current text-gray-800 cursor-pointer"
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 2028.38 448.31"
								>
									<path
										d="M0,5.69H92.29v192.4H98l157-192.4H365.66L203.73,201.08l163.85,241H257.21L137.68,262.66,92.29,318.05v124H0Z"
										transform="translate(-0.03 0.28)"
									/>
									<path
										d="M586,448c-116.34,0-204.34-82-204.34-224.15C381.64,81.12,469.64-.28,586-.28c115.7,0,204.34,81.4,204.34,224.16S701.68,448,586,448Zm0-366.7c-67.12,0-110.8,50.07-110.8,142.55S518.86,366.42,586,366.42c66.9,0,110.8-50.07,110.8-142.54S652.88,81.33,586,81.33Z"
										transform="translate(-0.03 0.28)"
									/>
									<path
										d="M858.49,5.69h172.17c99.08,0,156.39,55.82,156.39,142.54,0,59.67-27.48,102.92-77.13,124.23l92.69,169.6H1100.76l-82.68-154.69H950.75V442.06H858.49ZM1013.4,213.22c52.84,0,78.62-21.73,78.62-65,0-43.46-25.78-67.11-79-67.11H950.75v132.1Z"
										transform="translate(-0.03 0.28)"
									/>
									<path
										d="M1235.62,5.69H1594V81.76H1460.42v360.3h-91.2V81.76h-133.6Z"
										transform="translate(-0.03 0.28)"
									/>
									<polygon points="1821.38 6.28 1731.38 6.28 1614.56 442.28 1704.56 442.28 1821.38 6.28" />
									<polygon points="2028.38 6.28 1938.38 6.28 1821.56 442.28 1911.56 442.28 2028.38 6.28" />
								</svg>
							</Link>
						</div>
					</div>
					<div className="absolute inset-y-0 right-0 flex items-center sm:static sm:inset-auto sm:ml-6 sm:pr-0">
						{user.loggedIn && (
							<div className="ml-3 relative" ref={wrapperRef}>
								<div>
									<button
										className="flex text-sm border-2 border-transparent rounded-full focus:outline-none focus:border-white"
										id="user-menu"
										aria-label="User menu"
										aria-haspopup="true"
										onClick={() =>
											setUserDropdownState(
												!userDropdownOpen
											)
										}
									>
										<a className="ml-4 px-3 py-2 rounded-md text-sm font-medium leading-5 text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 transition duration-150 ease-in-out">
											{user.email}
										</a>
									</button>
								</div>
								<CSSTransition
									mountOnEnter
									unmountOnExit
									timeout={200}
									classNames="general-transition"
									in={userDropdownOpen}
								>
									<div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg">
										<div
											className="py-1 rounded-md bg-white shadow-xs"
											aria-orientation="vertical"
											aria-labelledby="user-menu"
										>
											<a
												onClick={() => {
													if (signOut) signOut();
													setUserDropdownState(false);
												}}
												className="block mx-4 my-2 text-sm leading-5 text-gray-800 focus:outline-none focus:bg-gray-200 cursor-pointer"
											>
												Sign out
											</a>
										</div>
									</div>
								</CSSTransition>
							</div>
						)}
					</div>
				</div>
			</div>
		</nav>
	);
};

export default Header;

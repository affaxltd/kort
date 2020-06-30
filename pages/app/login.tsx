import Link from "next/link";
import { useContext } from "react";
import UserContext from "../../context/UserContext";
import Router from "next/router";
import { NextSeo } from "next-seo";

function Login() {
	const { user } = useContext(UserContext);

	try {
		if (user.loggedIn) {
			Router.push("/app/dashboard");
			return null;
		}
	} catch (e) {}

	return (
		<div id="login">
			<NextSeo noindex={true} title="Login" />
			<div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
				<div className="max-w-sm w-full">
					<div>
						<h2 className="mt-6 text-center text-3xl leading-9 font-extrabold text-gray-900">
							Sign in to your account
						</h2>
					</div>

					<div className="mt-16">
						<Link href={`/api/oauth2/authorize`} key="Github">
							<button className="relative mt-4 w-full flex justify-center py-2 px-4 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition duration-150 ease-in-out">
								Github
							</button>
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Login;

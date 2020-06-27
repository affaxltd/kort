import { useContext } from "react";
import UserContext from "../../context/UserContext";
import Router from "next/router";
import { NextSeo } from "next-seo";
import AddLink from "../../components/sections/AddLink";

const Dashboard = () => {
	const { user } = useContext(UserContext);

	try {
		if (!user.loggedIn) {
			Router.push("/app/login");
			return null;
		}
	} catch (e) {}

	return (
		<div id="dashboard" className="container px-5 mx-auto pt-20">
			<NextSeo noindex={true} title="Dashboard" />
			<header>
				<div className="w-full pt-6">
					<h1 className="text-4xl font-bold leading-tight text-gray-900">
						Dashboard
					</h1>
				</div>
			</header>
			<main>
				<div className="my-9 bg-white rounded-lg overflow-hidden shadow-xl transform transition-all w-full">
					<AddLink />
				</div>
			</main>
		</div>
	);
};

export default Dashboard;

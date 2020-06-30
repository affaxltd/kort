import { useContext, useEffect, useRef } from "react";
import UserContext from "../../context/UserContext";
import Router from "next/router";
import { NextSeo } from "next-seo";
import AddLink from "../../components/sections/AddLink";
import useSWR, { useSWRPages } from "swr";
import fetcher from "../../lib/fetcher";
import useOnScreen from "../../hooks/use-on-screen";
import { Link as LinkType } from "../../types/_link";
import Link from "../../components/custom/Link";
import Button from "../../components/primitives/Button";
import Spinner from "../../components/primitives/Spinner";
import { CSSTransition } from "react-transition-group";
import Housekeeping from "../../components/sections/Housekeeping";

const Dashboard = () => {
	const { user } = useContext(UserContext);

	try {
		if (!user.loggedIn) {
			Router.push("/app/login");
			return null;
		}
	} catch (e) {}

	const { pages, isLoadingMore, loadMore, isReachingEnd } = useSWRPages(
		"links",
		({ offset, withSWR }) => {
			const url = offset || "/api/links";
			const { data } = withSWR(
				useSWR(url, fetcher, {
					refreshInterval: 1000,
				})
			);

			if (!data) return null;

			const { results }: { results: LinkType[] } = data;
			return results.map((result) => (
				<Link key={result.slug} link={result} />
			));
		},
		(SWR) => SWR.data.next,
		[]
	);

	const loadMoreButton = useRef(null);
	const isOnScreen = useOnScreen(loadMoreButton, "100px");

	useEffect(() => {
		if (!isOnScreen) return;

		loadMore();
	}, [isOnScreen]);

	return (
		<div id="dashboard" className="container px-5 mx-auto pt-16 mb-10">
			<NextSeo noindex={true} title="Dashboard" />
			<main>
				<section id="add-link">
					<div className="w-full mt-14">
						<h1 className="text-3xl font-bold leading-tight text-gray-900">
							Add Link
						</h1>
					</div>
					<div className="mt-5 bg-white rounded-lg shadow-xl w-full">
						<AddLink refresh={loadMore} />
					</div>
				</section>
				<section id="links" className="mt-14">
					<div className="w-full">
						<h1 className="text-3xl font-bold leading-tight text-gray-900">
							Links
						</h1>
					</div>
					<div className="mt-5 bg-white rounded-lg shadow-xl w-full">
						<div className="flex flex-col">
							<div className="-my-2 py-2 overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
								<div className="align-middle inline-block min-w-full overflow-hidden rounded-md">
									<table className="min-w-full">
										<thead>
											<tr>
												<th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
													Shortened
												</th>
												<th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
													Target
												</th>
												<th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
													Clicks
												</th>
												<th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
													Created
												</th>
												<th className="px-6 py-3 border-b border-gray-200 bg-gray-50"></th>
											</tr>
										</thead>
										<tbody>{pages}</tbody>
									</table>
								</div>
							</div>
						</div>
						<div className="py-3 px-3 w-full flex bg-gray-50 rounded-b-md">
							<Button
								buttonRef={loadMoreButton}
								color="green"
								text="Load more"
								disabled={isLoadingMore || isReachingEnd}
								onClick={() => {
									loadMore();
								}}
							/>
							<CSSTransition
								mountOnEnter
								unmountOnExit
								timeout={200}
								classNames="general-transition"
								in={isLoadingMore}
							>
								<div className="ml-3 w-6 flex flex-col justify-center flex-stretch">
									<Spinner color="gary-900" />
								</div>
							</CSSTransition>
						</div>
					</div>
				</section>
				<section id="housekeeping" className="mt-14">
					<div className="w-full">
						<h1 className="text-3xl font-bold leading-tight text-gray-900">
							Housekeeping
						</h1>
						<div className="mt-5 bg-white rounded-lg shadow-xl w-full">
							<Housekeeping />
						</div>
					</div>
				</section>
			</main>
		</div>
	);
};

export default Dashboard;

import Header from "../components/Header";
import UserContext, { UserState } from "../context/UserContext";
import App, { AppProps } from "next/app";
import Head from "next/head";
import config from "../config.json";
import nookies from "nookies";
import Router from "next/router";
import Loader from "../components/HOCLoader";
import { WebUser } from "../types/_user";
import { DefaultSeo, NextSeo } from "next-seo";
import { Fragment, createRef, RefObject } from "react";
import AlertContext from "../context/AlertContext";
import Alert from "../components/primitives/Alert";

import "../styles/index.scss";

type AppState = {
	loading: boolean;
};

class MyApp extends App {
	state: UserState & AppState = {
		user: {
			loggedIn: false,
			email: "",
		},
		loading: false,
	};
	alertRef?: RefObject<Alert>;

	constructor(props: AppProps) {
		super(props);
		this.alertRef = createRef();
	}

	signOut = () => {
		nookies.destroy(null, "user", {
			path: "/",
		});
		this.setState({
			user: {
				loggedIn: false,
				email: "",
			},
		});
		Router.push("/app/login");
	};

	signIn = (user: WebUser) => {
		this.setState({
			user,
		});
	};

	componentDidMount() {
		this.setState({ loading: true });
		const location = window.location;
		fetch(`${location.protocol}//${location.host}/api/user/me`)
			.then((json) => json.json())
			.then((user) => {
				this.setState({ loading: false, user: user });
			})
			.catch(() => {
				this.setState({ loading: false });
			});
	}

	render() {
		const { Component, pageProps } = this.props;

		return (
			<Fragment>
				<Alert ref={this.alertRef} />
				<AlertContext.Provider value={{ alert: this.alertRef }}>
					<Fragment>
						<DefaultSeo
							openGraph={{
								type: "website",
								locale: "en_IE",
								site_name: "Kort",
								description: config.site_description || "",
								title: "Kort Shortener",
							}}
							titleTemplate="Kort Shortener | %s"
							description={config.site_description || ""}
						/>
						<NextSeo title="Loading" />
						<Head>
							<link
								rel="icon"
								type="image/png"
								href="/favicon.png"
							/>
						</Head>
						<Loader full={true} isLoading={this.state.loading}>
							<UserContext.Provider
								value={{
									user: this.state.user,
									signOut: this.signOut,
									signIn: this.signIn,
								}}
							>
								<div id="app">
									<Header />
									<Component {...pageProps} />
								</div>
							</UserContext.Provider>
						</Loader>
					</Fragment>
				</AlertContext.Provider>
			</Fragment>
		);
	}
}

export default MyApp;

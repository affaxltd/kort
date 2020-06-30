import fetch from "unfetch";

const fetcher = async (url: string) => {
	return await (await fetch(url)).json();
};

export default fetcher;

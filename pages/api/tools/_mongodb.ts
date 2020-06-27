import url from "url";
import { MongoClient, Db } from "mongodb";

const connectionUri = process.env.MONGO_URI;

let cachedDb: Db | null = null;

export const connect = async (): Promise<Db | null> => {
	try {
		if (!connectionUri) return null;

		if (cachedDb) {
			return cachedDb;
		}

		const client = await MongoClient.connect(connectionUri, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
		const db = client.db(
			(url.parse(connectionUri).pathname || "_main").substr(1)
		);

		cachedDb = db;
		return db;
	} catch (e) {
		return null;
	}
};

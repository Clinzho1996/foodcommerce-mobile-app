import { CreateUserParams, GetMenuParams, SignInParams } from "@/type";
import {
	Account,
	Avatars,
	Client,
	Databases,
	ID,
	Query,
	Storage,
} from "react-native-appwrite";

export const appwriteConfig = {
	endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!,
	projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!,
	platform: "com.devclinton.foodcommerce",
	databaseId: "68baed390021f0054611",
	bucketId: "68bb07eb001129230446",
	userCollectionId: "user",
	categoriesCollectionId: "categories",
	menuCollectionId: "menu",
	customizationsCollectionId: "customizations",
	menuCustomizationsCollectionId: "menu_customizations",
};

export const client = new Client();

client
	.setEndpoint(appwriteConfig.endpoint)
	.setProject(appwriteConfig.projectId)
	.setPlatform(appwriteConfig.platform);

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
const avatars = new Avatars(client);

export const createUser = async ({
	email,
	password,
	phone,
	address,
	name,
}: CreateUserParams) => {
	try {
		const newAccount = await account.create(ID.unique(), email, password, name);
		if (!newAccount) throw Error;

		await signIn({ email, password });

		const avatarUrl = avatars.getInitialsURL(name);

		return await databases.createDocument(
			appwriteConfig.databaseId,
			appwriteConfig.userCollectionId,
			ID.unique(),
			{
				email,
				name,
				phone,
				address,
				accountId: newAccount.$id,
				avatar: avatarUrl,
			}
		);
	} catch (e) {
		throw new Error(e as string);
	}
};

export const signIn = async ({ email, password }: SignInParams) => {
	try {
		const session = await account.createEmailPasswordSession(email, password);

		return session;
	} catch (e) {
		throw new Error(e as string);
	}
};

export const getCurrentUser = async () => {
	try {
		const currentAccount = await account.get();
		if (!currentAccount) return null;

		const currentUser = await databases.listDocuments(
			appwriteConfig.databaseId,
			appwriteConfig.userCollectionId,
			[Query.equal("accountId", currentAccount.$id)]
		);

		if (!currentUser || currentUser.documents.length === 0) {
			return null; // no matching user found
		}

		return currentUser.documents[0];
	} catch (e) {
		console.log("getCurrentUser error:", e);
		return null;
	}
};

export const getMenu = async ({ category, query }: GetMenuParams) => {
	try {
		const queries: string[] = [];

		if (category) queries.push(Query.equal("categories", category));
		if (query) queries.push(Query.search("name", query));

		const menus = await databases.listDocuments(
			appwriteConfig.databaseId,
			appwriteConfig.menuCollectionId,
			queries
		);

		return menus.documents;
	} catch (e) {
		throw new Error(e as string);
	}
};

export const getMenuById = async ($id: string) => {
	try {
		const menu = await databases.getDocument(
			appwriteConfig.databaseId,
			appwriteConfig.menuCollectionId,
			$id
		);
		return menu;
	} catch (e) {
		console.error("getMenuById error:", e);
		throw new Error(e as string);
	}
};

export const getCategories = async () => {
	try {
		const categories = await databases.listDocuments(
			appwriteConfig.databaseId,
			appwriteConfig.categoriesCollectionId
		);

		return categories.documents;
	} catch (e) {
		throw new Error(e as string);
	}
};

import { Account, Client, Databases,OAuthProvider } from 'appwrite';

export const conf = {
    appwriteUrl: import.meta.env.VITE_APPWRITE_URL,
    appwriteProjectId: import.meta.env.VITE_APPWRITE_PROJECT_ID,
    appwriteDatabaseId: import.meta.env.VITE_APPWRITE_DATABASE_ID,
    appwriteCollectionId: import.meta.env.VITE_APPWRITE_COLLECTION_ID,
}
const client = new Client();
client.setEndpoint(conf.appwriteUrl).setProject(conf.appwriteProjectId);


export const account = new Account(client);
export const databases = new Databases(client);
export { ID } from 'appwrite';
export default client;
export { OAuthProvider }
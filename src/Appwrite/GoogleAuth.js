/** https://appwrite.io/blog/post/set-up-google-auth-appwrite-react */
// src/auth.js

import { OAuthProvider, account } from "./Config"

export const loginWithGoogle = async () => {
    try {
        return await account.createOAuth2Session(OAuthProvider.Google,
            `${window.location.origin}/auth/success`,
            `${window.location.origin}/auth/fail`,[])
    } catch (error) {
        // console.log("ERROR", error);
        return false;
    }
}


import { ID, account } from "./Config";

export const loginUser = async (email,password)=>{
    try {
        return await account.createEmailPasswordSession(email,password);
    } catch (error) {
        // console.log("ERROR",error);
        return false;
    }
}
export const signupUser = async (email,password,username)=>{
    try {
        return await account.create(ID.unique(),email,password,username);
    } catch (error) {
        // console.log("ERROR",error);
        return false;
    }
}
export const getUser = async ()=>{
    try {
        return await account.get();
    } catch (error) {
        // console.log("ERROR",error);
        return false;
    }
}
export const updateNameUser = async (username)=>{
    try {
        return await account.updateName(username);
    } catch (error) {
        // console.log("ERROR",error);
        return false;
    }
}
export const logoutUser = async ()=>{
    try {
        return await account.deleteSession("current")
    } catch (error) {
        // console.log("ERROR",error);
        return false;
    }
}
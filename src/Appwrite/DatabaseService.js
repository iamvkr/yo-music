import { Query } from "appwrite";
import { ID, conf, databases } from "./Config"


export const listData = async (authUserId)=>{
    try {
        // return await databases.listDocuments(conf.appwriteDatabaseId,conf.appwriteCollectionId);
        return await databases.listDocuments(conf.appwriteDatabaseId,conf.appwriteCollectionId,[
            Query.equal("userId",authUserId)
        ]);
    } catch (error) {
        console.log("ERROR",error);
        return false;
    }
}
export const addData = async (userId,{productName,salesPrice,costPrice,productStock})=>{
    try {
        return await databases.createDocument(conf.appwriteDatabaseId,conf.appwriteCollectionId,ID.unique(),{
            productName,
            salesPrice,
            costPrice,
            productStock,
            userId
        });
    } catch (error) {
        console.log("ERROR",error);
        return false;
    }
}
export const updateData = async (docId,newData)=>{
    const {productName,salesPrice,costPrice,productStock} = newData;
    try {
        return await databases.updateDocument(conf.appwriteDatabaseId,conf.appwriteCollectionId,docId,{
            productName,
            salesPrice,
            costPrice,
            productStock
        });
    } catch (error) {
        console.log("ERROR",error);
        return false;
    }
}
export const deleteData = async (docId)=>{
    try {
        return await databases.deleteDocument(conf.appwriteDatabaseId,conf.appwriteCollectionId,docId);
    } catch (error) {
        console.log("ERROR",error);
        return false;
    }
}
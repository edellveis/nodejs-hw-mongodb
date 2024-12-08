import mongoose from "mongoose";
import { getEnvVar } from "../utils/getEnvVar.js";


export const initMongoDB = async () => {
try {
     const user = getEnvVar("MONGODB_USER");
     const password = getEnvVar("MONGODB_PASSWORD");
     const url = getEnvVar("MONGODB_URL");
     const database = getEnvVar("MONGODB_DB");
    await mongoose.connect(`mongodb+srv://${user}:${password}@${url}/${database}?retryWrites=true&w=majority&appName=Cluster0`);
   console.log("Mongo connection successfully established!");
} catch (error) {
    console.log(`Erorr connection Mongo ${error.message}`);
    throw error;
}

};
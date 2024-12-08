import {setupServer} from "./sarver.js";
import { initMongoDB } from "./db/initMongoDB.js";
const boostrap = async () => {

    await initMongoDB();
    setupServer();
};
boostrap();
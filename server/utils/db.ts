import mongoose from "mongoose";
import { DB_URI } from "../config/env.config";
export const connectToDB = async (): Promise<void> => {
    try {
        if (!DB_URI) {
            throw new Error("Database URI is not defined");
        }

        const connection = await mongoose.connect(DB_URI, {
            dbName: "Your_DB_Name",
        });
        console.log(`DB Connected to ${connection.connection.host}`);
    } catch (error: any) {
        console.error("DB Connection failed:", error.message);
        setTimeout(connectToDB, 3000);
    }
};

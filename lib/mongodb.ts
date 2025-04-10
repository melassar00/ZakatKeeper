import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;

if (!uri) {
    throw new Error("Please define the MONGODB_URI environment variable in .env");
}

const client = new MongoClient(uri);

declare global {
    // Allow global variable reuse in development
    var _mongoClientPromise: Promise<MongoClient> | undefined;
}

export const connectToDB = async () => {
    try {
        await client.connect();
        console.log("✅ MongoDB connected successfully");
        const db = client.db("zakat-keeper");
        return db;
    } catch (error) {
        console.error("MongoDB connection error:", error);
        throw new Error("Could not connect to MongoDB");
    }
};

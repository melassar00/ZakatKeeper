import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;

if (!uri) {
    throw new Error("Please define the MONGODB_URI environment variable in .env.local");
}

console.log(uri);
console.log("✅ Connecting to MongoDB...");

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

declare global {
    // Allow global variable reuse in development
    var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (process.env.NODE_ENV === "development") {
    if (!global._mongoClientPromise) {
        client = new MongoClient(uri); // ✅ TS now knows uri is a string
        global._mongoClientPromise = client.connect().then((client) => {
            console.log("✅ MongoDB connected successfully!");
            return client;
        });
    }
    clientPromise = global._mongoClientPromise;
} else {
    client = new MongoClient(uri); // ✅ Safe again
    clientPromise = client.connect();
}

export default clientPromise;

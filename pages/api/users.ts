// pages/api/test-db.ts
import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../lib/mongodb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const client = await clientPromise;
        const db = client.db();
        const collections = await db.listCollections().toArray();

        res.status(200).json({
            message: "✅ MongoDB connected!",
            collections: collections.map((c) => c.name),
        });
    } catch (error) {
        console.error("❌ MongoDB connection error:", error);
        res.status(500).json({ error: "Connection failed" });
    }
}

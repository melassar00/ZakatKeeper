// pages/api/users.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { getZakatCollection } from "../../lib/models/zakat";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const zakatCol = await getZakatCollection();

    if (req.method === "POST") {
        const { name, email } = req.body;

        //TODO replace with new zakat
        const newUser = {
            name,
            email,
            createdAt: new Date(),
        };

        const result = await zakatCol.insertOne(newUser);
        res.status(201).json({
            _id: result.insertedId,
            ...newUser,
        });
    } else if (req.method === "GET") {
        const { userID } = req.query;
        const allZakats = await zakatCol.find({ userID }).toArray();
        res.status(200).json(allZakats);
    } else {
        res.setHeader("Allow", ["GET", "POST"]);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}

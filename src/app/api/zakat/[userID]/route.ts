// app/api/zakat/[userID]/route.ts
import { connectToDB } from "../../../../../lib/mongodb";
import { NextResponse } from "next/server";
import { Zakat } from "../../../../../types/zakat";

export async function GET(req: Request, { params }: { params: { userID: string } }) {
    const { userID } = await params;

    try {
        const db = await connectToDB();

        const user = await db.collection("zakat").findOne({ userID });

        if (!user) {
            return NextResponse.json({ error: "Zakat entry not found" }, { status: 404 });
        }

        return NextResponse.json(user);
    } catch (err) {
        console.error("Error fetching user:", err);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    const zakat: Zakat = await req.json(); // get full zakat object from request body
    const { userID, _id, ...updateData } = zakat;
    try {
        const db = await connectToDB();
        const user = await db.collection("zakat").findOneAndUpdate({ userID }, { $set: updateData }, { returnDocument: "after" });
        if (!user) {
            return NextResponse.json({ error: "Zakat entry not found" }, { status: 404 });
        }

        return NextResponse.json(user);
    } catch (err) {
        console.error("Error fetching user:", err);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

// export async function POST(req: Request, { params }: { params: { userID: string } }) {

// }

// vv OMAR THIS WAS YOUR STUFF (previously api/zakat.ts) vv

// // pages/api/users.ts
// import type { NextApiRequest, NextApiResponse } from "next";
// import { getZakatCollection } from "../../lib/models/zakat";

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//     const zakatCol = await getZakatCollection();

//     if (req.method === "POST") {
//         const { name, email } = req.body;

//         //TODO replace with new zakat
//         const newUser = {
//             name,
//             email,
//             createdAt: new Date(),
//         };

//         const result = await zakatCol.insertOne(newUser);
//         res.status(201).json({
//             _id: result.insertedId,
//             ...newUser,
//         });
//     } else if (req.method === "GET") {
//         const { userID } = req.query;
//         const allZakats = await zakatCol.find({ userID }).toArray();
//         res.status(200).json(allZakats);
//     } else {
//         res.setHeader("Allow", ["GET", "POST"]);
//         res.status(405).end(`Method ${req.method} Not Allowed`);
//     }
// }

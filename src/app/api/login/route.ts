// app/api/zakat/[userID]/route.ts
import { connectToDB } from "../../../../lib/mongodb";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { UserInfo } from "../../../../types/userInfo";

//GET for LOGIN
export async function POST(req: Request) {
    const body = await req.json();
    const { userID, password } = body;
    try {
        const db = await connectToDB();

        const user = await db.collection("users").findOne({ userID });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
        }

        return NextResponse.json({ message: "Login successful", userId: user._id });
    } catch (err) {
        console.error("Error fetching user:", err);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

//PUT for SIGN UP
export async function PUT(req: Request) {
    const userInfo: UserInfo = await req.json();
    const { userID, password } = userInfo;
    const hashedPassword = await bcrypt.hash(password, 10); // 10 = salt rounds
    try {
        const db = await connectToDB();
        const user = await db.collection("users").findOne({ userID });
        if (user) {
            return NextResponse.json(
                { error: "An account already exists for this email. If this is your email, please reset your password." },
                { status: 404 }
            );
        } else {
            const user = await db.collection("users").insertOne({ userID, password: hashedPassword });
            return NextResponse.json({ message: "Account created successfully" }, { status: 200 });
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

// app/api/users/[userID]/route.ts
import { connectToDB } from "../../../../../lib/mongodb";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: { userID: string } }) {
    const { userID } = await params;

    try {
        const db = await connectToDB();

        const user = await db.collection("users").findOne({ userID });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json(user);
    } catch (err) {
        console.error("Error fetching user:", err);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

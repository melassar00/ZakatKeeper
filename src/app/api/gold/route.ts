import { NextResponse } from "next/server";

// goldPrice.ts
export async function GET(req: Request, { params }: { params: { userID: string } }) {
    const res = await fetch("https://www.goldapi.io/api/XAU/USD", {
        headers: {
            "x-access-token": "goldapi-1j3019m9h3c4pu-io",
            "Content-Type": "application/json",
        },
    });
    if (!res.ok) {
        throw new Error("Failed to fetch gold price");
    }
    const data = await res.json();

    return NextResponse.json(data);
}

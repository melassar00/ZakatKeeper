// lib/models/zakat.ts
import clientPromise from "../mongodb";

export async function getZakatCollection() {
    const client = await clientPromise;
    return client.db().collection("zakat");
}

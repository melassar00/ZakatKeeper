import { ObjectId } from "mongodb";
import { ZakatYear } from "./years";

export interface Zakat {
    _id?: ObjectId;
    userID: string;
    years: ZakatYear[];
}

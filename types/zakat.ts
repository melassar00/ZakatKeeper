// types/user.ts
import { ObjectId } from "mongodb";
import { Year } from "./years";

export interface Zakat {
    _id?: ObjectId;
    userID: string;
    years: Year[];
}

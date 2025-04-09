// types/user.ts
import { Decimal128, Double } from "mongodb";

export interface AccountBalance {
    name: string;
    balance: Double;
}

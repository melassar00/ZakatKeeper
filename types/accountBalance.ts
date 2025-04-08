// types/user.ts
import { Decimal128 } from "mongodb";

export interface AccountBalance {
    name: string;
    balance: Decimal128;
}

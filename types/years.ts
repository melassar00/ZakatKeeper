// types/user.ts
import { Decimal128 } from "mongodb";
import { AccountBalance } from "./accountBalance";

export interface Year {
    year: string;
    accountBalances: AccountBalance[];
    totalAssetValue: Decimal128;
    totalDebtValue: Decimal128;
}

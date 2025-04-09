// types/user.ts
import { Double } from "mongodb";
import { AccountBalance } from "./accountBalance";

export interface Year {
    year: string;
    accountBalances: AccountBalance[];
    totalAssetValue: Double;
    totalDebtValue: Double;
    zakatDueOn: Double;
}

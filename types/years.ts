import { Double } from "mongodb";
import { AccountBalance } from "./accountBalance";
import { Debt } from "./debt";

export interface ZakatYear {
    year: string;
    accountBalances: AccountBalance[];
    debtsOwed?: Debt[];
    totalAssetValue: number;
    totalDebtValue: number;
    zakatDueOn: number;
    status: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETE";
}

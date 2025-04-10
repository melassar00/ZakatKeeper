import { Double } from "mongodb";

export interface AccountBalance {
    id: number;
    name: string;
    type: string;
    balance: number;
}

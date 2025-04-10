import { ZakatYear } from "./years";

export interface User {
    userID: string;
    name?: string;
    email?: string;
    years: ZakatYear[];
    // TODO: add anything else
}

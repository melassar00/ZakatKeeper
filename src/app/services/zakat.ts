import { Zakat } from "../../../types/zakat";

export const ZakatService = {
    getZakat: async (userID: string): Promise<Zakat> => {
        try {
            const rawResponse = await fetch("/api/zakat?userID=" + userID);
            const content = await rawResponse.json();
            if (content) {
                return content[0] as Zakat;
            } else {
                return {} as Zakat;
            }
        } catch (e) {
            console.error(e);
            return {} as Zakat;
        }
    },
};

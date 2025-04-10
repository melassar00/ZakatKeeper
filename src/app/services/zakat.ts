import { Zakat } from "../../../types/zakat";

export const ZakatService = {
    getUserZakat: async (userID: string): Promise<Zakat> => {
        try {
            const rawResponse = await fetch(`/api/zakat/${userID}`);
            const content = await rawResponse.json();
            if (content) {
                return content as Zakat;
            } else {
                return {} as Zakat;
            }
        } catch (e) {
            console.error(e);
            return {} as Zakat;
        }
    },
};

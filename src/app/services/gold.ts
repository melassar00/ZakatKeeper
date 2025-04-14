export const GoldService = {
    getGoldInfo: async (): Promise<any> => {
        try {
            const rawResponse = await fetch(`/api/gold/`);
            const content = await rawResponse.json();
            if (content) {
                return content as any;
            } else {
                return {} as any;
            }
        } catch (e) {
            console.error(e);
            return {} as any;
        }
    },
};

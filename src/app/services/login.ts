import { UserInfo } from "../../../types/userInfo";

export const LoginService = {
    login: async (body: Partial<UserInfo>): Promise<any> => {
        try {
            const response = await fetch(`/api/login/`, {
                method: "POST",
                body: JSON.stringify(body),
                headers: { "Content-Type": "application/json" },
            });
            const content = await response.json();
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
    signup: async (body: Partial<UserInfo>): Promise<any> => {
        try {
            const response = await fetch(`/api/login/`, {
                method: "PUT",
                body: JSON.stringify(body),
                headers: { "Content-Type": "application/json" },
            });
            const content = await response.json();
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

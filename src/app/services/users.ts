import { User } from "../../../types/user";

export const UserService = {
    getUserInfo: async (userID: string): Promise<User> => {
        try {
            const rawResponse = await fetch(`/api/users/${userID}`);
            const content = await rawResponse.json();
            console.log(content);
            if (content) {
                return content[0] as User;
            } else {
                return {} as User;
            }
        } catch (e) {
            console.error(e);
            return {} as User;
        }
    },
};

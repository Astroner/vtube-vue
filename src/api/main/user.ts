import { axios } from "@/helpers/axios";

export const signIn = async (username: string, password: string) => {
    const { data } = await axios.post<{ token: string }>("/user/sign-in/", {
        username, password,
    });

    return data;
};

export const signUp = async (username: string, password: string, ytID: string) => {
    const { data } = await axios.post("/user/sign-up/", {
        username, password, ytID,
    });

    return data;
};

export const getInfo = async (token: string) => {
    const { data } = await axios.get<{ username: string }>("/user/info/", {
        headers: {
            Authorization: token,
        },
    });

    return data;
};

import axios from "axios";

const authEndpoint = process.env.REACT_APP_SERVER_URL + "/api/auth";

export const handleLogin = async (email, password) => {
    try {
        const response = await axios.post(
            authEndpoint + "/login",
            {
                email,
                password,
            },
            {
                withCredentials: true,
            }
        );

        return Promise.resolve(response.data);
    } catch (error) {
        return Promise.reject(error);
    }
};

export const handleLogout = async () => {
    try {
        const response = await axios.post(authEndpoint + "/logout", null, {
            withCredentials: true,
        });

        return Promise.resolve(response.data);
    } catch (error) {
        return Promise.reject(error);
    }
};

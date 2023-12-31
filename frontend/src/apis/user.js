import axios from "axios";

const flightEndpoint = process.env.REACT_APP_SERVER_URL + "/api/users";

export const createFlightBooking = async (flight) => {
    console.log(flight);
    try {
        const response = await axios.post(flightEndpoint + "/reserve", flight, {
            withCredentials: true,
        });

        return Promise.resolve(response.data);
    } catch (error) {
        return Promise.reject(error);
    }
};

export const getCurrentUser = async () => {
    try {
        const response = await axios.get(flightEndpoint + "/detail", {
            withCredentials: true,
        });

        return Promise.resolve(response.data);
    } catch (error) {
        return Promise.reject(error);
    }
};

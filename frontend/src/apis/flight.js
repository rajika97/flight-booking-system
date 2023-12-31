import axios from "axios";

const flightEndpoint = process.env.REACT_APP_SERVER_URL + "/api/flights";

export const getAllFlights = async () => {
    try {
        const response = await axios.get(flightEndpoint, {
            withCredentials: true,
        });

        return Promise.resolve(response.data);
    } catch (error) {
        return Promise.reject(error);
    }
};

export const getFlightById = async (id) => {
    try {
        const response = await axios.get(flightEndpoint + "/find-name/" + id, {
            withCredentials: true,
        });

        return Promise.resolve(response.data);
    } catch (error) {
        return Promise.reject(error);
    }
};

export const createFlight = async (flight) => {
    try {
        const response = await axios.post(flightEndpoint, flight, {
            withCredentials: true,
        });

        return Promise.resolve(response.data);
    } catch (error) {
        return Promise.reject(error);
    }
};

export const updateFlight = async (id, flight) => {
    try {
        const response = await axios.put(flightEndpoint + "/" + id, flight, {
            withCredentials: true,
        });

        return Promise.resolve(response.data);
    } catch (error) {
        return Promise.reject(error);
    }
};

export const deleteFlight = async (id) => {
    try {
        const response = await axios.delete(flightEndpoint + "/" + id, {
            withCredentials: true,
        });

        return Promise.resolve(response.data);
    } catch (error) {
        return Promise.reject(error);
    }
};

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

export const getAllFlightBookings = async () => {
    try {
        const response = await axios.get(flightEndpoint + "/reserve", {
            withCredentials: true,
        });

        return Promise.resolve(response.data);
    } catch (error) {
        return Promise.reject(error);
    }
}

export const deleteFlightBooking = async (id) => {
    try {
        const response = await axios.delete(flightEndpoint + "/reserve/" + id, {
            withCredentials: true,
        });

        return Promise.resolve(response.data);
    } catch (error) {
        return Promise.reject(error);
    }
}

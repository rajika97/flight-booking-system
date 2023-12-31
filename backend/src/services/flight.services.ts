import { Flight } from "../entity/flight";

export type FlightObject = {
  id: string;
  flightName: string;
  departure: string;
  destination: string;
  date: string;
  time: string;
};

export const listFlights = async (): Promise<FlightObject[]> => {
  return await Flight.find();
};

export const getFlightById = async (
  id: string
): Promise<FlightObject | null> => {
  return Flight.findOneBy({
    id: id,
  });
};

export const getFlightByName = async (
  flightName: string
): Promise<FlightObject | null> => {
  return Flight.findOneBy({
    flightName: flightName,
  });
};

export const createFlight = async (
  flight: Omit<FlightObject, "id">
): Promise<FlightObject> => {
  const { flightName, departure, destination, date, time } = flight;
  const newFlight = new Flight();
  newFlight.flightName = flightName;
  newFlight.departure = departure;
  newFlight.destination = destination;
  newFlight.date = date;
  newFlight.time = time;
  return newFlight.save();
};

export const updateFlight = async (
  flight: Omit<FlightObject, "id">,
  id: string
): Promise<FlightObject> => {
  const { flightName, departure, destination, date, time } = flight;
  const flightToUpdate = await Flight.findOneBy({ id: id });
  if (!flightToUpdate) {
    throw new Error("Flight not found");
  }
  flightToUpdate.flightName = flightName;
  flightToUpdate.departure = departure;
  flightToUpdate.destination = destination;
  flightToUpdate.date = date;
  flightToUpdate.time = time;
  return flightToUpdate.save();
};

export const deleteFlight = async (id: string): Promise<void> => {
  const flightToDelete = await Flight.findOneBy({ id: id });
  if (!flightToDelete) {
    throw new Error("Flight not found");
  }
  flightToDelete.remove();
};

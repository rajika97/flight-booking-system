import type { Request, Response } from "express";
import { body, validationResult } from "express-validator";

import * as FlightService from "../services/flight.services";
import * as FlightUserService from "../services/flightUser.service";
import * as UserService from "../services/user.services";
import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
dotenv.config();

const accessSecret: string = process.env.JWT_ACCESS_SECRET || "";
interface ParsedCookies {
  [key: string]: string;
}

const getUserIdFromRequest = async (
  request: Request
): Promise<string | null> => {
  const list: ParsedCookies = {};
  const cookieHeader = request.headers?.cookie;

  if (cookieHeader === undefined) return null;

  cookieHeader.split(";").forEach(function (cookie) {
    let [name, ...rest] = cookie.split("=");
    name = name?.trim();
    if (!name) return;
    const value = rest.join("=").trim();
    if (!value) return;
    list[name] = decodeURIComponent(value);
  });

  const token = list["accessToken"];
  if (!token) return null;

  try {
    const decodedToken = jwt.verify(token, accessSecret) as { userId: string };
    const userId: string = decodedToken.userId;
    try {
      const user = await UserService.getUser(userId);
      if (user) {
        return userId;
      }
      return null;
    } catch (error: any) {
      return null;
    }
  } catch {
    return null;
  }
};

// GET: List of all flights
export const getFlights = async (request: Request, response: Response) => {
  try {
    const flights = await FlightService.listFlights();
    return response.status(200).json(flights);
  } catch (error: any) {
    return response.status(500).json(error.message);
  }
};

// GET: A single flight by ID
export const getFlightById = async (request: Request, response: Response) => {
  const id: string = request.params.id;
  try {
    const flight = await FlightService.getFlightById(id);
    if (flight) {
      return response.status(200).json(flight);
    }
    return response.status(404).json("Flight could not be found");
  } catch (error: any) {
    return response.status(500).json(error.message);
  }
};

// GET: A single flight by Nme
export const getFlightByName = async (request: Request, response: Response) => {
  const name: string = request.params.name;
  try {
    const flight = await FlightService.getFlightByName(name);
    if (flight) {
      return response.status(200).json(flight);
    }
    return response.status(404).json("Flight could not be found");
  } catch (error: any) {
    return response.status(500).json(error.message);
  }
};

// POST: Create a flight
export const createFlight = async (request: Request, response: Response) => {
  const errors = validationResult(request);
  if (!errors.isEmpty()) {
    return response.status(400).json({ errors: errors.array() });
  }
  try {
    const flight = request.body;
    const newFlight = await FlightService.createFlight(flight);
    return response.status(201).json(newFlight);
  } catch (error: any) {
    return response.status(500).json(error.message);
  }
};

// PUT: Updating a flight
export const updateFlight = async (request: Request, response: Response) => {
  const errors = validationResult(request);
  if (!errors.isEmpty()) {
    return response.status(400).json({ errors: errors.array() });
  }
  const id: string = request.params.id;
  try {
    const flight = request.body;
    const updateFlight = await FlightService.updateFlight(flight, id);
    return response.status(200).json(updateFlight);
  } catch (error: any) {
    return response.status(500).json(error.message);
  }
};

// POST: Reserve a flight
export const flightReserve = async (request: Request, response: Response) => {
  const userId = await getUserIdFromRequest(request);
  if (userId) {
    try {
      const flightUser = request.body;
      flightUser.userId = userId;
      const createFlightUser = await FlightUserService.createFlightUser(
        flightUser
      );
      return response.status(200).json(createFlightUser);
    } catch (error: any) {
      return response.status(500).json(error.message);
    }
  }
  return response.status(404).json("Unauthorized access");
};

// GET: get Reserved flights for requested user
export const reservedFlights = async (request: Request, response: Response) => {
  const userId = await getUserIdFromRequest(request);
  if (userId) {
    try {
      const FlightUsers = await FlightUserService.getFlightUserByUserId(userId);
      return response.status(200).json(FlightUsers);
    } catch (error: any) {
      return response.status(500).json(error.message);
    }
  }
  return response.status(404).json("Unauthorized access");
};

// DELETE: Delete a flight based on the id
export const deleteFlight = async (request: Request, response: Response) => {
  const id: string = request.params.id;
  try {
    await FlightService.deleteFlight(id);
    return response.status(204).json("Flight has been successfully deleted");
  } catch (error: any) {
    return response.status(500).json(error.message);
  }
};

// DELETE: Delete a flight based on the id
export const deleteFlightUser = async (
  request: Request,
  response: Response
) => {
  const id: string = request.params.id;
  try {
    await FlightUserService.deleteFlightUser(id);
    return response
      .status(204)
      .json("Reservation has been successfully deleted");
  } catch (error: any) {
    return response.status(500).json(error.message);
  }
};

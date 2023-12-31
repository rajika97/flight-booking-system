import express from "express";
import { body } from "express-validator";

import * as FlightContoller from "../controllers/flight.controller";
import { AuthenticationMiddleware } from "../middlewares/auth.middleware";

export const flightRouter = express.Router();

flightRouter.get(
  "/",
  AuthenticationMiddleware("USER"),
  FlightContoller.getFlights
);

flightRouter.get(
  "/find-id/:id",
  AuthenticationMiddleware("USER"),
  FlightContoller.getFlightById
);

flightRouter.get(
  "/find-name/:name",
  AuthenticationMiddleware("USER"),
  FlightContoller.getFlightByName
);

flightRouter.post(
  "/",
  body("flightName").isString(),
  body("departure").isString(),
  body("destination").isString(),
  body("date").isString(),
  body("time").isString(),
  FlightContoller.createFlight
);

flightRouter.put(
  "/:id",
  AuthenticationMiddleware("USER"),
  body("flightName").isString(),
  body("departure").isString(),
  body("destination").isString(),
  body("date").isString(),
  body("time").isString(),
  FlightContoller.updateFlight
);

flightRouter.delete(
  "/:id",
  AuthenticationMiddleware("USER"),
  FlightContoller.deleteFlight
);

flightRouter.post(
  "/reserve",
  AuthenticationMiddleware("USER"),
  body("flightId").isString(),
  body("numberOfSeats").isNumeric(),
  FlightContoller.flightReserve
);

flightRouter.get(
  "/reserve",
  AuthenticationMiddleware("USER"),
  FlightContoller.reservedFlights
);

flightRouter.delete(
  "/reserve/:id",
  AuthenticationMiddleware("USER"),
  FlightContoller.deleteFlightUser
);

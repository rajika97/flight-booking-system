import { DataSource } from "typeorm";
import { User } from "../entity/user";
import { RefreshToken } from "../entity/refreshToken";
import * as dotenv from "dotenv";
import { Flight } from "../entity/flight";
import { FlightUser } from "../entity/flightUser";

dotenv.config();

export const myDataSource = new DataSource({
  type: "postgres",
  host: process.env.HOST,
  port: 5432,
  username: process.env.USERNAME1,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  entities: [Flight, User, RefreshToken, FlightUser],
  logging: true,
  synchronize: true,
});

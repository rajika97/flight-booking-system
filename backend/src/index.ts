import * as dotenv from "dotenv";
import express from "express";
import cors from "cors";
import http from "http";

import { flightRouter } from "./routes/flight.routes";
import { userRouter } from "./routes/user.routes";
import { authRouter } from "./routes/auth.routes";
import { myDataSource } from "./utils/app-data-source";

dotenv.config();

if (!process.env.PORT) {
  process.exit(1);
}

const PORT: number = parseInt(process.env.PORT as string, 10);

myDataSource
  .initialize()
  .then(() => {
    console.log("Data Source has been initialized!");
  })
  .catch((err) => {
    console.error("Error during Data Source initialization:", err);
  });

export const app = express();

const server = http.createServer(app);

app.use(cors({ credentials: true, origin: true }));
console.log("HelooHelooo");
const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.options("*", cors());
app.use(express.json());
app.use("/api/flights", flightRouter);
app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

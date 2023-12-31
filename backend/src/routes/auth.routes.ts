import express from "express";
import * as AuthController from "../controllers/auth.controllers";

export const authRouter = express.Router();

authRouter.post("/login", AuthController.login);
authRouter.post("/logout", AuthController.logout);
authRouter.post("/refresh", AuthController.refresh);

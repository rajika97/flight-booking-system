import { Request, Response } from "express";
import bcrypt from "bcrypt";
import * as UserServices from "../services/user.services";
import * as AuthService from "../services/auth.service";
import * as dotenv from "dotenv";

import jwt from "jsonwebtoken";
const { v4: uuidv4 } = require("uuid");
dotenv.config();

const accessSecret: string = process.env.JWT_ACCESS_SECRET || "";
const refreshSecret: string = process.env.JWT_REFRESH_SECRET || "";

export const login = async (request: Request, response: Response) => {
  const { email, password } = request.body;
  const user = await UserServices.findUserByEmail(email);
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return response.status(401).json({ message: "Invalid email or password" });
  }
  const accessToken = jwt.sign(
    { userId: user.id, userRole: user.role },
    accessSecret,
    {
      expiresIn: "1d",
    }
  );
  const id = uuidv4();
  const refreshToken = jwt.sign(
    { id: id, userId: user.id, userRole: user.role },
    refreshSecret,
    {
      expiresIn: "1d",
    }
  );

  try {
    const tokenObject = { id: id, token: refreshToken, userId: user.id };
    await AuthService.createToken(tokenObject);
    response.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: "none",
      secure: true,
    });
    response.cookie("accessToken", accessToken, {
      httpOnly: true,
      maxAge: 10 * 60 * 60 * 1000,
      sameSite: "none",
      secure: true,
    });
    return response.status(200).json({ message: "Success login" });
  } catch (error: any) {
    return response.status(500).json(error.message);
  }
};

interface ParsedCookies {
  [key: string]: string;
}

export const logout = async (request: Request, response: Response) => {
  try {
    const list: ParsedCookies = {};
    const cookieHeader = request.headers?.cookie;
    if (!cookieHeader) return list;

    cookieHeader.split(`;`).forEach(function (cookie) {
      let [name, ...rest] = cookie.split(`=`);
      name = name?.trim();
      if (!name) return;
      const value = rest.join(`=`).trim();
      if (!value) return;
      list[name] = decodeURIComponent(value);
    });
    const token = list["refreshToken"];
    try {
      const decodedToken = jwt.verify(token, refreshSecret) as {
        id: string;
      };
      AuthService.deleteToken(decodedToken.id);
      response.clearCookie("accessToken");
      response.clearCookie("refreshToken");
      return response.status(200).json({ message: "Logged out" });
    } catch {
      return response.status(401).json("Refresh token is not valid");
    }
  } catch {
    return response.status(401).json("Refresh token is not valid");
  }
};

export const refresh = async (request: Request, response: Response) => {
  const token = request.cookies.refreshToken;
  const verified = jwt.verify(token, refreshSecret) as {
    id: string;
    userId: string;
    userRole: string;
  };
  if (verified) {
    try {
      const existingToken = await AuthService.getToken(verified.id);
      if (existingToken) {
        const accessToken = jwt.sign(
          { userId: verified.userId, userRole: verified.userRole },
          accessSecret,
          {
            expiresIn: "10m",
          }
        );

        return response.cookie("accessToken", accessToken, {
          httpOnly: true,
          maxAge: 10 * 60 * 1000,
        });
      }
      return response.status(404).json("Refresh token is not valid");
    } catch (error: any) {
      return response.status(500).json(error.message);
    }
  }
  return response.status(404).json("Refresh token is not valid");
};

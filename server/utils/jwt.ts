import { Response } from "express"
import {
  ACCESS_TOKEN_EXPIRES,
  NODE_ENV,
  REFRESH_TOKEN_EXPIRES,
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,
} from "../config/env.config"
import { redisClient } from "./redis"
import { IUser } from "../models/user.model"
import { parse } from "path"

interface ITokenOptions {
  expires: Date
  maxAge: number
  httpOnly: boolean
  sameSite: "lax" | "strict" | "none"
  secure: boolean
}


export const accessTokenExpires = Number(ACCESS_TOKEN_EXPIRES) || 900
export const refreshTokenExpires = Number(REFRESH_TOKEN_EXPIRES) || 2592000

export const accessTokenOptions: ITokenOptions = {
  expires: new Date(Date.now() + accessTokenExpires * 1000),
  maxAge: accessTokenExpires * 1000,
  httpOnly: true,
  sameSite: "lax",
  secure: false,
}

export const refreshTokenOptions: ITokenOptions = {
  expires: new Date(Date.now() + 2592000 * 1000),
  maxAge: 2592000 * 1000,
  httpOnly: true,
  sameSite: "lax",
  secure: false,
}


export const sendToken = (user: IUser, statusCode: number, res: Response) => {
  const accessToken = user.SignAccessT1oken(ACCESS_TOKEN_SECRET as string)
  const refreshToken = user.SignRefreshToken(REFRESH_TOKEN_SECRET as string)

  redisClient?.set(user._id as string, JSON.stringify(user), "EX", 604800)

  res.cookie("access_token", accessToken, accessTokenOptions)
  res.cookie("refresh_token", refreshToken, refreshTokenOptions)

  res.status(statusCode).json({
    success: true,
    accessToken,
    user,
  })
}

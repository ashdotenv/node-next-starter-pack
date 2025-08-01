import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { catchAsyncError } from "./catchAsyncError";
import { redisClient } from "../utils/redis";
import { ErrorHandler } from "../utils/ErrorHandler";
import { ACCESS_TOKEN_SECRET } from "../config/env.config";

export const isAuthenticated = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const access_token = req.cookies.access_token as string;
      if (!access_token) {
        return next(
          new ErrorHandler("Please login to access this resource", 401)
        );
      }

      const decoded = jwt.verify(
        access_token,
        ACCESS_TOKEN_SECRET as string
      ) as JwtPayload;

      if (!decoded) {
        return next(new ErrorHandler("Access token is not valid", 401));
      }
      const user = await redisClient?.get(decoded.id);
      if (!user) {
        return next(new ErrorHandler("User not found", 404));
      }
      req.user = JSON.parse(user);

      next();
    } catch (error: any) {
      if (
        error.name === "JsonWebTokenError" ||
        error.name === "TokenExpiredError"
      ) {
        return next(new ErrorHandler("Invalid or expired token", 401));
      }
      return next(new ErrorHandler(error.message, 500));
    }
  }
);
export const authorizeRoles = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes(req?.user?.role || "")) {
      return next(
        new ErrorHandler(
          `Role ${req.user?.role} is not allowed to access this resource`,
          401
        )
      );
    }
    next();
  };
};

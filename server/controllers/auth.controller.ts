import { NextFunction, Request, Response } from "express";
import { catchAsyncError } from "../middleware/catchAsyncError";
import { ErrorHandler } from "../utils/ErrorHandler";
import { User } from "../models/user.model";
import {
  ACCESS_TOKEN_SECRET,
  ACTIVATION_SECRET,
  REFRESH_TOKEN_SECRET,
} from "../config/env.config";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import ejs from "ejs";
import path from "path";
import {
  accessTokenOptions,
  refreshTokenOptions,
  sendToken,
} from "../utils/jwt";
import { redisClient } from "../utils/redis";
import { sendEmail } from "../utils/email";
interface IRegistrationBody {
  name: string;
  email: string;
  password: string;
  avatar?: string;
}

interface IActivationToken {
  token: string;
  activationCode: string;
}

export const registerUser = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, email, password } = req.body as IRegistrationBody;
    const emailExist = await User.findOne({ email });
    if (emailExist) {
      return next(new ErrorHandler("Email Already Exists", 400));
    }
    const userPayload = { name, email, password };
    const { token, activationCode } = createActivationToken(userPayload);

    const data = { user: { name }, activationCode };

    const html = await ejs.renderFile(
      path.join(__dirname, "../mails/activation-mails.ejs"),
      data
    );

    try {
      await sendEmail({
        email: email,
        subject: "Activate Your Account",
        template: "activation-mails.ejs",
        data,
      });

      res.status(201).json({
        success: true,
        message: `Please check your email (${email}) to activate your account.`,
        activationToken: token,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

function createActivationToken(user: IRegistrationBody): IActivationToken {
  const activationCode = Math.floor(1000 + Math.random() * 9000).toString();
  const token = jwt.sign(
    { user, activationCode },
    ACTIVATION_SECRET as Secret,
    { expiresIn: "10m" }
  );
  return { token, activationCode };
}

interface IActivationRequest {
  activation_token: string;
  activation_code: string;
}

export const activateUser = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { activation_token, activation_code } =
      req.body as IActivationRequest;

    const decoded = jwt.verify(
      activation_token,
      ACTIVATION_SECRET as string
    ) as { user: IRegistrationBody; activationCode: string };

    const { user, activationCode } = decoded;

    if (activation_code !== activationCode) {
      return next(new ErrorHandler("Invalid Activation Code", 400));
    }

    const { name, email, password } = user;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new ErrorHandler("User Already Exists", 400));
    }

    await User.create({ name, email, password });

    res.status(200).json({
      success: true,
      message: "Account Activated Successfully",
    });
  }
);
interface ILoginRequest {
  email: string;
  password: string;
}
export const loginUser = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body as ILoginRequest;
      if (!email || !password) {
        return next(
          new ErrorHandler("Please enter both Email and Password", 400)
        );
      }
      const user = await User.findOne({ email }).select("+password");
      if (!user) {
        return next(
          new ErrorHandler("User with this Email doesn't exist", 401)
        );
      }
      const isPasswordMatch = await user.comparePassword(password);
      if (!isPasswordMatch) {
        return next(new ErrorHandler("Incorrect password", 401));
      }
      sendToken(user, 200, res);
    } catch (error: any) {
      console.log(error);
      return next(new ErrorHandler(error.message, 500));
    }
  }
);
export const logoutUser = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.cookie("access_token", "", { maxAge: 1 });
      res.cookie("refresh_token", "", { maxAge: 1 });
      const userId = req.user?.id;
      redisClient?.del(userId);
      res.status(200).json({
        success: true,
        message: "Logged out successfully",
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);
export const updateAccessToken = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const refresh_token = req.cookies.refresh_token as string;
      const decoded = jwt.verify(
        refresh_token,
        REFRESH_TOKEN_SECRET as string
      ) as JwtPayload;
      if (!decoded) {
        return next(new ErrorHandler("Couldn't Refresh Token", 401));
      }
      const session = await redisClient?.get(decoded.id as string);
      if (!session) {
        return next(new ErrorHandler("Couldn't Refresh Token", 401));
      }
      const user = JSON.parse(session);
      const access_token = jwt.sign(
        { id: user._id },
        ACCESS_TOKEN_SECRET as string,
        {
          expiresIn: "5m",
        }
      );
      req.user = user;
      res.cookie("access_token", access_token, accessTokenOptions);
      res.cookie("refresh_token", refresh_token, refreshTokenOptions);
      res.status(200).json({ status: "success", access_token });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

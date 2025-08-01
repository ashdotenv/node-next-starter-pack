import { Response } from "express";
import { User } from "../models/user.model";
import { redisClient } from "../utils/redis";

export const getUserById = async (id: string, res: Response) => {
  const userJson = await redisClient?.get(id);
  if (userJson) {
    const user = JSON.parse(userJson);
    res.status(200).json({ user, success: true });
  }
};
export const getAllUsersService = async (res: Response) => {
  const users = await User.find().sort({ createdAt: -1 })
  redisClient?.set("allUsers", JSON.stringify(users))
  res.status(200).json({ users, success: true });
};
export const updateUserRoleService = async (res: Response, id: string, role: string) => {
  const user = await User.findByIdAndUpdate(id, { role }, { new: true })
  res.status(201).json({
    succes: true,
    user
  })
}

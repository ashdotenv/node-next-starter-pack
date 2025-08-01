import Redis from "ioredis";
import { REDIS_URI } from "../config/env.config";

if (!REDIS_URI) {
  throw new Error("REDIS_URI is not defined in the environment");
}

export let redisClient: Redis | null = null;

export const connectToRedis = (): void => {
  if (!redisClient) {
    redisClient = new Redis(REDIS_URI as string);

    redisClient.on("connect", () => {
      console.log("Redis connected");
    });

    redisClient.on("error", (err) => {
      console.error("❌ Redis connection error:", err);
    });
  }
};

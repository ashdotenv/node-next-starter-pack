import { app } from "./app";
import { PORT } from "./config/env.config";
import { connectToDB } from "./utils/db";
import { connectToRedis } from "./utils/redis";

app.listen(PORT, () => {
    connectToDB()
    connectToRedis()
    console.log(`Serving on http://localhost:${PORT}`);
})
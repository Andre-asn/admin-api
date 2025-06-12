import "dotenv/config";
import app from "./app";
import { Server } from "http";

const PORT: string | 5000 = process.env.PORT || 5000;

const server: Server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default server;

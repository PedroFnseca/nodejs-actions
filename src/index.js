import express from "express";
import router from "./router.js";
import { config } from "dotenv";
import cors from "cors";

const server = express();
const PORT = process.env.PORT || 3000;

config();

server.use(cors());
server.use(express.json());

server.use('/api', router);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
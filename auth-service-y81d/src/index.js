import express from "express";
import path from 'path';
import fs from 'fs';
import cors from "cors";
import logger from 'morgan';
import { fileURLToPath } from 'url';
import authRoutes from "./routes/auth.routes.js";
import helmet from 'helmet';

import dotenv from "dotenv";
dotenv.config();

const PORT_APP = process.env.PORT_APP;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const accessLogStream = fs.createWriteStream(path.join(__dirname, '/logs/access.log'), { flags: 'a' });

const app = express();

app.use(helmet());
app.use(cors());
app.use(logger('dev'));
app.use(logger('combined', {stream: accessLogStream}))
app.use(express.json());

app.use("/", authRoutes);

app.listen(PORT_APP, () => {
  console.log(`Auth-Service running on port ${PORT_APP}`);
});

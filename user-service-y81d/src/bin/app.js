import createError from 'http-errors';
import express from 'express';
import path from 'path';
import fs from 'fs';
import logger from 'morgan';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import { fileURLToPath } from 'url';
import '../../config/database.js';
import userRoutes from '../routes/user.routes.js'
dotenv.config();

const app = express();
const PORT_APP = process.env.PORT_APP;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const accessLogStream = fs.createWriteStream(path.join(__dirname, '/logs/access.log'), { flags: 'a' });


app.use(helmet());
app.use(cors());
app.use(logger('dev'));
app.use(logger('combined', {stream: accessLogStream}))
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    res.status(200).json({
        status: 200,
        message: "berhasil get data",
        data: "Hallo dari express"
    })
})

app.use('/', userRoutes);

app.use((req, res, next) => {
    res.status(404).json(createError(400, "Not Found Page you looking for"))
})

app.listen(PORT_APP, () => {
    console.log(`User-Service running on port ${PORT_APP}`);
})
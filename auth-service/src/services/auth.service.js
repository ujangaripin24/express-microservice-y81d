import axios from "axios";
import bcrypt from "bcrypt";
import { generateToken, verifyToken } from "../utils/jwt.js";
import dotenv from "dotenv";
dotenv.config();

const USER_SERVICE_URL = process.env.USER_SERVICE_URL;

export const loginService = async (email, password) => {
    try {
        const response = await axios.get(`${USER_SERVICE_URL}/email/${email}`);
        const user = response.data;

        if (!user) {
            return { status: 404, data: { msg: "User tidak ditemukan" } };
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return { status: 401, data: { msg: "Password salah" } };
        }

        const token = generateToken({ uuid: user.uuid, email: user.email, role: user.role });

        return { status: 200, data: { token } };
    } catch (error) {
        return { status: 500, data: { msg: error.message } };
    }
};

export const meService = async (token) => {
    const decoded = verifyToken(token);
    if (!decoded) {
        return { status: 401, data: { msg: "Token tidak valid" } };
    }

    try {
        const response = await axios.get(`${USER_SERVICE_URL}/detail/${decoded.uuid}`);
        return { status: 200, data: response.data };
    } catch (error) {
        return { status: 500, data: { msg: error.message } };
    }
};

import { body, param } from 'express-validator'
import db from '../../models/index.js'
const { TblUsers } = db;

export const CreateUserValidator = [
    body('username').notEmpty().withMessage("username tidak boleh kosong"),
    body('email')
        .isEmail()
        .withMessage("email tidak boleh kosong")
        .custom(async (a) => {
            const existingUser = await TblUsers.findOne({ where: { email: a } })
            if (existingUser) {
                throw new Error("email sudah terdaftar");
            }
            return true
        }),
    body('password').notEmpty().withMessage("password tidak boleh kosong").isLength({ min: 8 }).withMessage("password minimal 8 karakter"),
    body('confPassword')
        .notEmpty().withMessage("Confirm password is required")
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error("Password dan confirm password tidak sama");
            }
            return true;
        }),
    body('role').notEmpty().withMessage("role tidak boleh kosong"),
]

export const UpdateUserValidator = [
    param('uuid')
        .notEmpty().withMessage("uuid tidak boleh kosong")
        .custom(async (a) => {
            const existingUser = await TblUsers.findOne({ where: { uuid: a } })
            if (!existingUser) {
                throw new Error("user tidak ditemukan");
            }
            return true
        }),
    body('username')
        .notEmpty().withMessage('Username wajib diisi')
        .custom(async (value, { req }) => {
            const user = await TblUsers.findOne({
                where: {
                    username: value
                }
            });
            if (user && user.uuid !== req.params.uuid) {
                throw new Error('Username sudah digunakan oleh user lain');
            }

            return true;
        }),
    body('email')
        .isEmail()
        .withMessage('Invalid email')
        .custom(async (value, { req }) => {
            const user = await TblUsers.findOne({ where: { email: value } })
            if (user && user.uuid !== req.params.uuid) {
                throw new Error('Email already exists')
            }
            return true
        }),
    body('password').notEmpty().withMessage("password tidak boleh kosong").isLength({ min: 8 }).withMessage("password minimal 8 karakter"),
    body('confPassword')
        .notEmpty().withMessage("Confirm password is required")
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error("Password dan confirm password tidak sama");
            }
            return true;
        }),
]
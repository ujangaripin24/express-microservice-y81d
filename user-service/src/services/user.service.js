import db from '../../models/index.js'
import { Op } from 'sequelize'
import { hashPassword } from '../utils/password.hash.js'

const { TblUsers } = db;

export const GetAllUsers = async ({ page = 1, size = 10, search = "" }) => {
    const limit = parseInt(size);
    const offset = (page - 1) * limit;

    const where = search ? {
        [Op.or]: [
            { username: { [Op.like]: `%${search}%` } },
            { email: { [Op.like]: `%${search}%` } }
        ]
    } : {};

    const { rows, count } = await TblUsers.findAndCountAll({
        attributes: ['uuid', 'username', 'email', 'createdAt', 'updatedAt'],
        where,
        offset,
        limit,
        order: [['createdAt', 'DESC']]
    })
    const totalPages = Math.ceil(count / limit);
    return {
        data: rows,
        size: limit,
        page: parseInt(page),
        totalPages,
        totalData: count
    }
}

export const GetUserByUUID = async (uuid) => {
    const user = await TblUsers.findOne({
        where: { uuid },
        attributes: ['uuid', 'username', 'email', 'role', 'createdAt', 'updatedAt']
    })
    return user
}

export const CreateUser = async (data) => {
    const {username, email, password, role} = data;
    const hashedPassword = await hashPassword(password);
    const user = await TblUsers.create({
        username,
        email,
        password: hashedPassword,
        role
    })
    return user
}

export const UpdateUser = async(uuid, payload) => {
    const user = await TblUsers.findOne({where: {uuid}})
    if (!user) {
        throw new Error('User not found');
    }
    const { username, email, role } = payload;

    user.username = username
    user.email = email
    user.role = role

    if (password) {
        const hashedPassword = await hashPassword(password);
        user.password = hashedPassword
    }

    await user.save()
    return user
}

export const DeleteUser = async (uuid) => {
    const user = await TblUsers.findOne({where: {uuid}})
    if (!user) {
        throw new Error('User not found');
    }
    await user.destroy()
    return user
}

export const GetUserByEmail = async (email) => {
  const user = await TblUsers.findOne({ where: { email } });
  return user;
};
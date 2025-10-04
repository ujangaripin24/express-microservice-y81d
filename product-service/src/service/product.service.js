import db from '../../models/index.js'
import { Op } from 'sequelize'

const { TblUsers } = db;

export const GetAllProduct = async ({ page = 1, size = 10, search = "" }) => {
    const limit = parseInt(size);
    const offset = (page - 1) * limit;

    const where = search ? {
        [Op.or]: [
            { name: { [Op.like]: `%${search}%` } }
        ]
    } : {};

    const { rows, count } = await TblUsers.findAndCountAll({
        attributes: ['uuid', 'name', 'price', 'description', 'createdAt', 'updatedAt'],
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
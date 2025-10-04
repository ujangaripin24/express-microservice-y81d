import { Op } from 'sequelize';
import db from '../../models/index.js'
import axios from "axios";

const { TblProducts } = db;

const USER_SERVICE_URL = process.env.USER_SERVICE_URL;

export const GetAllProduct = async ({ page = 1, size = 10, search = "" }) => {
  const limit = parseInt(size);
  const offset = (page - 1) * limit;

  const where = search ? {
    [Op.or]: [
      { name: { [Op.like]: `%${search}%` } },
    ]
  } : {};

  const products = await TblProducts.findAndCountAll({
    where,
    offset,
    limit,
    order: [["createdAt", "DESC"]],
  });

  const { count, rows: data } = products;
  await Promise.all(products.rows.map(async (p) => {
    try {
      const userRes = await axios.get(`${USER_SERVICE_URL}/detail/${p.user_uuid}`)
      return {
        ...p.toJSON(),
        user: userRes.data,
      }
    } catch {
      return {
        ...p.toJSON(),
        user: null,
      }
    }
  })
  )

  const totalPages = Math.ceil(count / limit);
  return {
    data,
    size: limit,
    page: parseInt(page),
    totalPages,
    totalData: count
  }
}
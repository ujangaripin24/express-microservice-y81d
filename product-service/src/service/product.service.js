import { Op } from "sequelize";
import db from "../../models/index.js";
import axios from "axios";

const { TblProducts } = db;
const USER_SERVICE_URL = process.env.USER_SERVICE_URL;

// ini adalah arrow function dengan callback
// export const GetAllProduct = async ({ page = 1, size = 10, search = "" }) => {}

// ini adalah arrow function tanpa callback
// export const GetAllProduct = async () => {}

export const GetAllProduct = async ({ page = 1, size = 10, search = "" }) => {
  const limit = parseInt(size);
  const offset = (page - 1) * limit;

  const where = search
    ? { [Op.or]: [{ name: { [Op.like]: `%${search}%` } }] }
    : {};

  const products = await TblProducts.findAndCountAll({
    where,
    offset,
    limit,
    order: [["createdAt", "DESC"]],
  });

  if (!products.rows || products.rows.length === 0) {
    throw new Error("tidak ada data");
  }

  const { count } = products;
  const dataResult = await Promise.all(
    products.rows.map(async (p) => {
      try {
        const userRes = await axios.get(`${USER_SERVICE_URL}/detail/${p.user_uuid}`);
        return {
          ...p.toJSON(),
          user: userRes.data.data,
        };
      } catch {
        return {
          ...p.toJSON(),
          user: null,
        };
      }
    })
  );

  const totalPages = Math.ceil(count / limit);
  return {
    data: dataResult,
    size: limit,
    page: parseInt(page),
    totalPages,
    totalData: count,
  };
};

export const getProductByUUID = async (uuid) => {
  const product = await TblProducts.findOne({ where: { uuid } });
  if (!product) throw new Error("produk tidak ditemukan");

  const data = product.toJSON();

  try {
    const userRes = await axios.get(`${USER_SERVICE_URL}/detail/${data.user_uuid}`);
    data.user = userRes.data.data;
  } catch {
    data.user = null;
  }

  return { data };
};

export const CreateProduct = async (user_uuid, payload) => {
  const { name, price, description } = payload;
  if (!name || !price) throw new Error("name dan price wajib diisi");

  const product = await TblProducts.create({
    name,
    price,
    description,
    user_uuid,
  });

  return { data: product };
};

export const UpdateProduct = async (user_uuid, uuid, payload) => {
  const { name, price, description } = payload;
  const product = await TblProducts.findOne({ where: { uuid } });
  if (!product) throw new Error("product tidak ditemukan");

  if (product.user_uuid !== user_uuid) {
    throw new Error("tidak diizinkan");
  }

  product.name = name ?? product.name;
  product.price = price ?? product.price;
  product.description = description ?? product.description;
  await product.save();

  return { data: product };
};

export const DeleteProduct = async (user_uuid, uuid) => {
  const product = await TblProducts.findOne({ where: { uuid } });
  if (!product) throw new Error("product tidak ditemukan");

  if (product.user_uuid !== user_uuid) {
    throw new Error("tidak diizinkan");
  }

  await product.destroy();
  return { msg: "Product deleted" };
};

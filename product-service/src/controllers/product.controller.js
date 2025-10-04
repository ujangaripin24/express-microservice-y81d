import db from "../../models/index.js";
import * as productService from '../service/product.service.js'
const { TblProducts } = db;
import axios from "axios";

const USER_SERVICE_URL =
  process.env.USER_SERVICE_URL;

export const createProduct = async (req, res) => {
  try {
    const { name, price, description } = req.body;

    const product = await TblProducts.create({
      name,
      price,
      description,
      user_uuid: req.user.uuid,
    });

    return res.status(201).json(product);
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

export const getProducts = async (req, res) => {
  try {
    const { page, size, search } = req.query;
    const result = await productService.GetAllProduct({ page, size, search });
    if (!result.data || result.data.length === 0) {
      res.status(500).json({ errors: [{ msg: "tidak ada data" }] });
    }

    res.status(200).json({
      status: 200,
      data: result.data,
      size: result.size,
      page: result.page,
      totalPage: result.totalPage,
      totalData: result.totalData
    })
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

export const getProduct = async (req, res) => {
  try {
    const { uuid } = req.params;
    const product = await TblProducts.findOne({ where: { uuid } });
    if (!product) return res.status(404).json({ msg: "Product not found" });

    let user = null;
    try {
      const userRes = await axios.get(`${USER_SERVICE_URL}/detail/${product.user_uuid}`);
      user = userRes.data;
    } catch { }

    return res.json({ ...product.toJSON(), user });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { uuid } = req.params;
    const { name, price, description } = req.body;

    const product = await TblProducts.findOne({ where: { uuid } });
    if (!product) return res.status(404).json({ msg: "Product not found" });

    if (product.user_uuid !== req.user.uuid) {
      return res.status(403).json({ msg: "Not authorized" });
    }

    product.name = name;
    product.price = price;
    product.description = description;
    await product.save();

    return res.json(product);
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { uuid } = req.params;
    const product = await TblProducts.findOne({ where: { uuid } });
    if (!product) return res.status(404).json({ msg: "Product not found" });

    if (product.user_uuid !== req.user.uuid) {
      return res.status(403).json({ msg: "Not authorized" });
    }

    await product.destroy();
    return res.json({ msg: "Product deleted" });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

import * as productService from "../service/product.service.js";

export const createProduct = async (req, res) => {
  try {
    await productService.CreateProduct(req.user.uuid, req.body);
    res.status(201).json({
      status: 201,
      message: "Produk berhasil dibuat",
    });
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
};

export const getProducts = async (req, res) => {
  try {
    const { page, size, search } = req.query;
    const result = await productService.GetAllProduct({ page, size, search });
    res.status(200).json({
      status: 200,
      ...result,
    });
  } catch (err) {
    res.status(404).json({ msg: err.message });
  }
};

export const getProduct = async (req, res) => {
  try {
    const { uuid } = req.params;
    const result = await productService.getProductByUUID(uuid);
    res.status(200).json({
      status: 200,
      data: result.data,
    });
  } catch (err) {
    res.status(404).json({ msg: err.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { uuid } = req.params;
    const result = await productService.UpdateProduct(req.user.uuid, uuid, req.body);
    res.status(200).json({
      status: 200,
      message: "Produk berhasil diperbarui",
      data: result.data,
    });
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { uuid } = req.params;
    const result = await productService.DeleteProduct(req.user.uuid, uuid);
    res.status(200).json({
      status: 200,
      message: "Produk berhasil dihapus",
    });
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
};

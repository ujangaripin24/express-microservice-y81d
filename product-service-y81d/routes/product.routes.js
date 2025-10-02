import { Router } from "express";
import {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/product.controller.js";
import { authMiddleware } from "../middlewares/guard.middleware.js";

const router = Router();

router.post("/create", authMiddleware, createProduct);
router.get("/get-all", getProducts);
router.get("/detail/:uuid", getProduct);
router.put("/update:uuid", authMiddleware, updateProduct);
router.delete("/delete/:uuid", authMiddleware, deleteProduct);

export default router;

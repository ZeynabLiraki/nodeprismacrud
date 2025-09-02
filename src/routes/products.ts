import { Router } from "express";
import { errorHandler } from "../errorHandler";
import { createProduct } from "../controllers/products";
import authMiddleware from "../midlewares/auth";
import adminMiddleware from "../midlewares/admin";

const productRouter: Router = Router();

productRouter.post("/",[authMiddleware, adminMiddleware], errorHandler(createProduct))

export default productRouter;
import { Router } from "express";
import { login, me, signup } from "../controllers/auth";
import { errorHandler } from "./../errorHandler";
import authMiddleware from "../midlewares/auth";

const authRoutes: Router = Router();

authRoutes.post("/signup", errorHandler(signup));
authRoutes.post("/login", errorHandler(login));
authRoutes.get("/me", [authMiddleware], errorHandler(me))

export default authRoutes;

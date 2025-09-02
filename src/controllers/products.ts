import { Request, Response, NextFunction } from "express";
import prismaClient from "../prisma/prismaClient";
import { ProductSchema } from "../schemas/products";
import { ExceptionError } from "../exceptions/exceptionError";
import { ErrorCode } from "../exceptions/root";

export const createProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const result = ProductSchema.safeParse(req.body);

  if (!result.success) {
    return next(
      new ExceptionError(
        "Invalid input data",
        422,
        ErrorCode.INVALID_INPUT_DATA,
        result.error.issues
      )
    );
  }

  const product = await prismaClient.product.create({
    data: { ...result.data, tags: result.data.tags.join(",") },
  });

  res.json(product);
};

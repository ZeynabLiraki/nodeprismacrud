import z from "zod";

export const ProductSchema = z.object({
  name: z.string().min(1, { message: "Product's name is required" }),
  description: z
    .string()
    .min(1, { message: "Product's description is required" }),
  price: z.union([
    z.number().positive({ message: "Price must be a positive number" }),
    z
      .string()
      .refine((val) => !isNaN(Number(val)), {
        message: "Price must be a number",
      })
      .transform((val) => Number(val)),
  ]),
  tags: z.array(z.string()).nonempty({ message: "At least one tag is needed" }),
});

import { z } from 'zod'
const createOrderZodSchema = z.object({
  body: z.object({
    cow: z.string({
      required_error: 'cow is required',
    }),
    buyer: z.string({
      required_error: 'Buyer is required',
    }),
  }),
})
const updateOrderZodSchema = z.object({
  body: z.object({}),
})
export const OrderValidation = {
  createOrderZodSchema,
  updateOrderZodSchema,
}

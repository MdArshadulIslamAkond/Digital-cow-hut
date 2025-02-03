import { z } from 'zod'
const updateBuyerZodSchema = z.object({
  body: z.object({
    name: z
      .object({
        firstName: z.string({}).optional(),
        lastName: z.string({}).optional(),
      })
      .optional(),
    phoneNumber: z.string({}).optional(),
    address: z.string({}).optional(),
    income: z.string({}).optional(),
    budget: z.string({}).optional(),
    profileImage: z.string({}).optional(),
  }),
})
export const BuyerValidation = {
  updateBuyerZodSchema,
}

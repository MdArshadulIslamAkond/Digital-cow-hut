import { z } from 'zod'
const createCowZodSchema = z.object({
  body: z.object({
    password: z.string().optional(),
    name: z.string({
      required_error: 'Name is required',
    }),
    age: z.string({
      required_error: 'Age is required',
    }),
    price: z.string({
      required_error: 'Price is required',
    }),
    location: z.string({
      required_error: 'Location is required',
    }),
    breed: z.string({
      required_error: 'Breed is required',
    }),
    weight: z.string({
      required_error: 'Weight is required',
    }),
    label: z.string({
      required_error: 'Label is required',
    }),
    category: z.string({
      required_error: 'Category is required',
    }),
    seller: z.string({
      required_error: 'Seller is required',
    }),
  }),
})
const updateCowZodSchema = z.object({
  body: z.object({
    name: z.string({}).optional(),
    age: z.string({}).optional(),
    price: z.string({}).optional(),
    location: z.string({}).optional(),
    breed: z.string({}).optional(),
    weight: z.string({}).optional(),
    label: z.string({}).optional(),
    category: z.string({}).optional(),
    seller: z.string({}).optional(),
  }),
})
export const CowValidation = {
  createCowZodSchema,
  updateCowZodSchema,
}

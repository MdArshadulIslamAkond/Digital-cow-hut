import { z } from 'zod'

const createSellerZodSchema = z.object({
  body: z.object({
    password: z.string().optional(),
    seller: z.object({
      name: z.object({
        firstName: z.string({
          required_error: 'First name is required',
        }),
        lastName: z.string({
          required_error: 'Last name is required',
        }),
      }),
      phoneNumber: z.string({
        required_error: 'Phone number is required',
      }),
      address: z.string({
        required_error: 'Address is required',
      }),
      income: z.string({
        required_error: 'Income is required',
      }),
      budget: z.string({
        required_error: 'Income is required',
      }),
      profileImage: z
        .string({
          required_error: 'Profile image is required',
        })
        .optional(),
    }),
  }),
})
const createBuyerZodSchema = z.object({
  body: z.object({
    password: z.string().optional(),
    buyer: z.object({
      name: z.object({
        firstName: z.string({
          required_error: 'First name is required',
        }),
        lastName: z.string({
          required_error: 'Last name is required',
        }),
      }),
      phoneNumber: z.string({
        required_error: 'Phone number is required',
      }),
      address: z.string({
        required_error: 'Address is required',
      }),
      income: z.string({
        required_error: 'Income is required',
      }),
      budget: z.string({
        required_error: 'Income is required',
      }),
      profileImage: z
        .string({
          required_error: 'Profile image is required',
        })
        .optional(),
    }),
  }),
})

export const userValidation = {
  createSellerZodSchema,
  createBuyerZodSchema,
}

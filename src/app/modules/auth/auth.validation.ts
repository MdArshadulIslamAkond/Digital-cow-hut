import { z } from 'zod'

const loginZodSchema = z.object({
  body: z.object({
    phoneNumber: z.string({
      required_error: 'PhoneNumber is required',
    }),
    password: z.string({
      required_error: 'Password is required',
    }),
  }),
})
const refreshTokenZodSchema = z.object({
  cookies: z.object({
    refreshAccessToken: z.string({
      required_error: 'Refresh Token is required',
    }),
  }),
})

export const AuthValidation = {
  loginZodSchema,
  refreshTokenZodSchema,
}

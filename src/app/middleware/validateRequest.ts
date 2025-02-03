import { AnyZodObject, ZodEffects } from 'zod'
import { NextFunction, Request, Response } from 'express'
import { errorlogger } from '../../shared/logger'

const validateRequest =
  (schema: AnyZodObject | ZodEffects<AnyZodObject>) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await schema.parseAsync({
        body: req.body,
        params: req.params,
        query: req.query,
        cookies: req.cookies,
      })
      next()
    } catch (error) {
      errorlogger.error('Error creating user', error)

      next(error)
    }
  }

export default validateRequest

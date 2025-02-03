import express from 'express'
import { UserController } from './user.controller'
import validateRequest from '../../middleware/validateRequest'
import { userValidation } from './user.validation'

const router = express.Router()
router.post(
  '/create-seller',
  validateRequest(userValidation.createSellerZodSchema),
  UserController.createSeller,
)
router.post(
  '/create-buyer',
  validateRequest(userValidation.createBuyerZodSchema),
  UserController.createBuyer,
)

export const UserRoutes = router

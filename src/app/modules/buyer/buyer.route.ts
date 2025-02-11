import express from 'express'
import validateRequest from '../../middleware/validateRequest'
import { BuyerValidation } from './buyer.validation'
import { BuyerController } from './buyer.controller'
import auth from '../../middleware/auth'
import { ENUM_USER_ROLE } from '../../../enums/user'
const router = express.Router()
router.patch(
  '/:id',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.BUYER),
  validateRequest(BuyerValidation.updateBuyerZodSchema),
  BuyerController.getUpdateBuyer,
)
router.get(
  '/',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.BUYER),
  BuyerController.getAllBuyer,
)
router.get(
  '/:id',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.BUYER),
  BuyerController.getSingleBuyer,
)
router.delete(
  '/:id',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.BUYER),
  BuyerController.getDeleteBuyer,
)

export const BuyerRoutes = router

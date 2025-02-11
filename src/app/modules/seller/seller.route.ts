import express from 'express'
import validateRequest from '../../middleware/validateRequest'
import { sellerValidation } from './seller.validation'
import { SellerController } from './seller.controller'
import auth from '../../middleware/auth'
import { ENUM_USER_ROLE } from '../../../enums/user'
const router = express.Router()
router.patch(
  '/:id',
  auth(ENUM_USER_ROLE.SELLER, ENUM_USER_ROLE.ADMIN),
  validateRequest(sellerValidation.updateSellerZodSchema),
  SellerController.getUpdateSeller,
)
router.get(
  '/',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SELLER),
  SellerController.getAllSeller,
)
router.get(
  '/:id',
  auth(ENUM_USER_ROLE.SELLER, ENUM_USER_ROLE.ADMIN),
  SellerController.getSingleSeller,
)
router.delete(
  '/:id',
  auth(ENUM_USER_ROLE.SELLER, ENUM_USER_ROLE.ADMIN),
  SellerController.getDeleteSeller,
)

export const SellerRoutes = router

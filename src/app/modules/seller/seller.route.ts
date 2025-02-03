import express from 'express'
import validateRequest from '../../middleware/validateRequest'
import { sellerValidation } from './seller.validation'
import { SellerController } from './seller.controller'
const router = express.Router()
router.patch(
  '/:id',
  validateRequest(sellerValidation.updateSellerZodSchema),
  SellerController.getUpdateSeller,
)
router.get('/', SellerController.getAllSeller)
router.get('/:id', SellerController.getSingleSeller)
router.delete('/:id', SellerController.getDeleteSeller)

export const SellerRoutes = router

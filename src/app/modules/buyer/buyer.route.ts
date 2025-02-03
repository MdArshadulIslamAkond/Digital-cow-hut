import express from 'express'
import validateRequest from '../../middleware/validateRequest'
import { BuyerValidation } from './buyer.validation'
import { BuyerController } from './buyer.controller'
const router = express.Router()
router.patch(
  '/:id',
  validateRequest(BuyerValidation.updateBuyerZodSchema),
  BuyerController.getUpdateBuyer,
)
router.get('/', BuyerController.getAllBuyer)
router.get('/:id', BuyerController.getSingleBuyer)
router.delete('/:id', BuyerController.getDeleteBuyer)

export const BuyerRoutes = router

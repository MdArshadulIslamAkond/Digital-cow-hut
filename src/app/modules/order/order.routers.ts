import express from 'express'
// import validateRequest from '../../middleware/validateRequest'
import { OrderController } from './order.controller'

const router = express.Router()

router.post(
  '/create-order',
  //   validateRequest(CowValidation.createCowZodSchema),
  OrderController.createOrder,
)
// router.get('/:id', CowController.getSingleCow)
// router.get('/', OrderController.getAllOrder)
// router.patch(
//   '/:id',
// //   validateRequest(CowValidation.updateCowZodSchema),
//   CowController.getUpdateCow,
// )
// router.delete('/:id', CowController.getDeleteCow)

export const orderRoutes = router

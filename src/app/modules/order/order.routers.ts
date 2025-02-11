import express from 'express'
// import validateRequest from '../../middleware/validateRequest'
import { OrderController } from './order.controller'
import validateRequest from '../../middleware/validateRequest'
import { OrderValidation } from './order.validation'
import auth from '../../middleware/auth'
import { ENUM_USER_ROLE } from '../../../enums/user'

const router = express.Router()

router.post(
  '/create-order',
  validateRequest(OrderValidation.createOrderZodSchema),
  auth(ENUM_USER_ROLE.BUYER),
  OrderController.createOrder,
)
router.get(
  '/:id',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.BUYER, ENUM_USER_ROLE.SELLER),
  OrderController.getSingleOrder,
)
router.get(
  '/',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.BUYER, ENUM_USER_ROLE.SELLER),
  OrderController.getAllOrder,
)
// router.patch(
//   '/:id',
// //   validateRequest(OrderValidation.updateOrderZodSchema),
//   OrderController.getUpdateCow,
// )
router.delete(
  '/:id',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.BUYER, ENUM_USER_ROLE.SELLER),
  OrderController.getDeleteOrder,
)

export const orderRoutes = router

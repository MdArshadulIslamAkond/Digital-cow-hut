import express from 'express'
import { UserController } from './user.controller'
import validateRequest from '../../middleware/validateRequest'
import { userValidation } from './user.validation'
import { ENUM_USER_ROLE } from '../../../enums/user'
import auth from '../../middleware/auth'

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

router.get('/', auth(ENUM_USER_ROLE.ADMIN), UserController.getAllUser)

router.get('/:id', UserController.getSingleUser)
router.patch(
  '/:id',
  auth(ENUM_USER_ROLE.ADMIN),
  validateRequest(userValidation.userUpdateSchema),
  UserController.getUpdateUser,
)
router.delete('/:id', auth(ENUM_USER_ROLE.ADMIN), UserController.getDeleteUser)
export const UserRoutes = router

import express from 'express'
import validateRequest from '../../middleware/validateRequest'
import { AdminValidation } from './admins.validation'
import { AdminController } from './admins.controller'
import auth from '../../middleware/auth'
import { ENUM_USER_ROLE } from '../../../enums/user'

const router = express.Router()

router.post(
  '/create-admin',
  validateRequest(AdminValidation.createAdminZodSchema),
  // auth(ENUM_USER_ROLE.ADMIN),
  AdminController.createAdmin,
)
router.get('/:id', auth(ENUM_USER_ROLE.ADMIN), AdminController.getSingleAdmin)
router.get('/', auth(ENUM_USER_ROLE.ADMIN), AdminController.getAllAdmin)
router.patch(
  '/:id',
  auth(ENUM_USER_ROLE.ADMIN),
  validateRequest(AdminValidation.updateAdminZodSchema),
  AdminController.getUpdateAdmin,
)
router.delete(
  '/:id',
  auth(ENUM_USER_ROLE.ADMIN),
  AdminController.getDeleteAdmin,
)

export const AdminRoutes = router

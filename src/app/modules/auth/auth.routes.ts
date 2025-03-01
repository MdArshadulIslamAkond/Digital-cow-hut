import express from 'express'

import validateRequest from '../../middleware/validateRequest'

import { AuthController } from './auth.controller'
import { AuthValidation } from './auth.validation'

const router = express.Router()
router.post(
  '/login',
  validateRequest(AuthValidation.loginZodSchema),
  AuthController.loginUser,
)
router.post(
  '/refresh-token',
  validateRequest(AuthValidation.refreshTokenZodSchema),
  AuthController.refreshToken,
)
// router.get('/', FacultyController.getAllFaculty)

// router.get('/:id', FacultyController.getSingleFaculty)
// router.patch(
//   '/:id',
//   validateRequest(FacultyValidation.updatedFacultyZodSchema),
//   FacultyController.getUpdateFaculty,
// )
// router.delete('/:id', FacultyController.getDeleteFaculty)

export const AuthRoutes = router

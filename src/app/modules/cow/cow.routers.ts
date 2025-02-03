import express from 'express'
import { CowController } from './cow.controller'
import validateRequest from '../../middleware/validateRequest'
import { CowValidation } from './cow.validation'

const router = express.Router()

router.post(
  '/create-cow',
  validateRequest(CowValidation.createCowZodSchema),
  CowController.createCow,
)
router.get('/:id', CowController.getSingleCow)
router.get('/', CowController.getAllCow)
router.patch(
  '/:id',
  validateRequest(CowValidation.updateCowZodSchema),
  CowController.getUpdateCow,
)
router.delete('/:id', CowController.getDeleteCow)

export const CowRoutes = router

import { Request, Response } from 'express'
import catchAsync from '../../../shared/catchAsync'
import sendResponse from '../../../shared/sendResponse'
import httpStatus from 'http-status'
import { UserService } from './user.services'
const createSeller = catchAsync(async (req: Request, res: Response) => {
  const { seller, ...user } = req.body
  const result = await UserService.createSeller(seller, user)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Seller created successfully',
    data: result,
  })
})
const createBuyer = catchAsync(async (req: Request, res: Response) => {
  const { buyer, ...user } = req.body
  const result = await UserService.createBuyer(buyer, user)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Buyer created successfully',
    data: result,
  })
})

export const UserController = {
  createSeller,
  createBuyer,
}

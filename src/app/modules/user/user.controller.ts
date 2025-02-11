import { Request, Response } from 'express'
import catchAsync from '../../../shared/catchAsync'
import sendResponse from '../../../shared/sendResponse'
import httpStatus from 'http-status'
import { UserService } from './user.services'
import pick from '../../../shared/pick'
import { IUser } from './user.interface'
import { paginationFields } from '../../../constants.ts/pagination'
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

const getAllUser = catchAsync(async (req: Request, res: Response) => {
  // const filters = pick(req.query, studentFilterableFields)
  const paginationOptions = pick(req.query, paginationFields)
  // console.log(paginationOptions)
  const result = await UserService.getAllUser(
    // filters,
    paginationOptions,
  )
  sendResponse<IUser[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Student retrieved successfully',
    meta: result.meta,
    data: result.data,
  })
})
const getSingleUser = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params
  const result = await UserService.getSingleUser(id)
  sendResponse<IUser>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Student retrieved successfully',
    data: result,
  })
})
const getUpdateUser = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params
  const updatedData = req.body
  const result = await UserService.getUpdateUser(id, updatedData)
  sendResponse<IUser>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User update successfully',
    data: result,
  })
})
const getDeleteUser = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params
  const result = await UserService.getDeleteUser(id)
  sendResponse<IUser>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User Deleted successfully',
    data: result,
  })
})
export const UserController = {
  createSeller,
  createBuyer,
  getAllUser,
  getSingleUser,
  getUpdateUser,
  getDeleteUser,
}

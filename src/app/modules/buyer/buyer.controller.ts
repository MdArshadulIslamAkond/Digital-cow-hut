import { Request, Response } from 'express'
import catchAsync from '../../../shared/catchAsync'
import sendResponse from '../../../shared/sendResponse'
import httpStatus from 'http-status'
import pick from '../../../shared/pick'
import { paginationFields } from '../../../constants.ts/pagination'
import { BuyerFilterableFields } from './buyer.constants'
import { IBuyer } from './buyer.interfaces'
import { BuyerService } from './buyer.services'

const getAllBuyer = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, BuyerFilterableFields)
  const paginationOptions = pick(req.query, paginationFields)
  // console.log(paginationOptions)
  const result = await BuyerService.getAllBuyer(filters, paginationOptions)
  sendResponse<IBuyer[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Buyer retrieved successfully',
    meta: result.meta,
    data: result.data,
  })
})
const getSingleBuyer = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params
  const result = await BuyerService.getSingleBuyer(id)
  sendResponse<IBuyer>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Buyer retrieved successfully',
    data: result,
  })
})
const getUpdateBuyer = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params
  const updatedData = req.body
  const result = await BuyerService.getUpdateBuyer(id, updatedData)
  sendResponse<IBuyer>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Buyer update successfully',
    data: result,
  })
})
const getDeleteBuyer = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params
  const result = await BuyerService.getDeleteBuyer(id)
  sendResponse<IBuyer>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Buyer Deleted successfully',
    data: result,
  })
})
export const BuyerController = {
  getAllBuyer,
  getSingleBuyer,
  getUpdateBuyer,
  getDeleteBuyer,
}

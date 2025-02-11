import { Request, Response } from 'express'
import catchAsync from '../../../shared/catchAsync'
import sendResponse from '../../../shared/sendResponse'
import httpStatus from 'http-status'
import pick from '../../../shared/pick'
import { sellerFilterableFields } from './seller.constants'
import { paginationFields } from '../../../constants.ts/pagination'
import { ISeller } from './seller.interface'
import { SellerService } from './seller.service'
import { JwtPayload } from 'jsonwebtoken'

const getAllSeller = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, sellerFilterableFields)
  const paginationOptions = pick(req.query, paginationFields)
  // console.log(paginationOptions)
  const result = await SellerService.getAllSeller(filters, paginationOptions)
  sendResponse<ISeller[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Seller retrieved successfully',
    meta: result.meta,
    data: result.data,
  })
})
const getSingleSeller = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params
  const { _id: sellerID, role } = req.user as JwtPayload
  const result = await SellerService.getSingleSeller(id, sellerID, role)
  sendResponse<ISeller>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Seller retrieved successfully',
    data: result,
  })
})
const getUpdateSeller = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params
  const { _id: sellerID, role } = req.user as JwtPayload
  const updatedData = req.body
  const result = await SellerService.getUpdateSeller(
    id,
    sellerID,
    role,
    updatedData,
  )
  sendResponse<ISeller>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Seller update successfully',
    data: result,
  })
})
const getDeleteSeller = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params
  const { _id: sellerID, role } = req.user as JwtPayload
  const result = await SellerService.getDeleteSeller(id, sellerID, role)
  sendResponse<ISeller>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Seller Deleted successfully',
    data: result,
  })
})
export const SellerController = {
  getAllSeller,
  getSingleSeller,
  getUpdateSeller,
  getDeleteSeller,
}

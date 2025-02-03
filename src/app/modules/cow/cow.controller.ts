import { Request, Response } from 'express'
import httpStatus from 'http-status'
import catchAsync from '../../../shared/catchAsync'
import sendResponse from '../../../shared/sendResponse'
import pick from '../../../shared/pick'
import { ICow } from './cow.interface'
import { cowFilterableFields } from './cow.constant'
import { paginationFields } from '../../../constants.ts/pagination'
import { CowService } from './cow.service'

const createCow = catchAsync(async (req: Request, res: Response) => {
  const { ...cowData } = req.body
  const result = await CowService.createCow(cowData)
  sendResponse<ICow>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Cow is created successfully',
    data: result,
  })
})
const getAllCow = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, cowFilterableFields)
  const paginationOptions = pick(req.query, paginationFields)
  const result = await CowService.getAllCow(filters, paginationOptions)
  sendResponse<ICow[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Cow are fetched successfully',
    meta: result.meta,
    data: result.data,
  })
})
const getSingleCow = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params
  const result = await CowService.getSingleCow(id)
  sendResponse<ICow>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Cow is fetched successfully',
    data: result,
  })
})

const getUpdateCow = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params
  const { ...cowData } = req.body
  const result = await CowService.getUpdateCow(id, cowData)
  sendResponse<ICow>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Cow is updated successfully',
    data: result,
  })
})
const getDeleteCow = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params
  const result = await CowService.getDeleteCow(id)
  sendResponse<ICow>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Cow is deleted successfully',
    data: result,
  })
})
export const CowController = {
  createCow,
  getAllCow,
  getSingleCow,
  getUpdateCow,
  getDeleteCow,
}

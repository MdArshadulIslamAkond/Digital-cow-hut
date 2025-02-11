import { Request, Response } from 'express'
import httpStatus from 'http-status'
import catchAsync from '../../../shared/catchAsync'
import sendResponse from '../../../shared/sendResponse'
// import pick from '../../../shared/pick'
// import { ICow } from './cow.interface'
// import { cowFilterableFields } from './cow.constant'
// import { paginationFields } from '../../../constants.ts/pagination'
// import { CowService } from './cow.service'
import { IOrder } from './order.interface'
import { OrderService } from './order.services'
import { paginationFields } from '../../../constants.ts/pagination'
import pick from '../../../shared/pick'
import { JwtPayload } from 'jsonwebtoken'

const createOrder = catchAsync(async (req: Request, res: Response) => {
  const { ...orderData } = req.body
  const result = await OrderService.createOrder(orderData)
  sendResponse<IOrder>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Order is created successfully',
    data: result,
  })
})
const getAllOrder = catchAsync(async (req: Request, res: Response) => {
  // const filters = pick(req.query, cowFilterableFields)
  const { ...varifiyData } = req.user as JwtPayload
  const paginationOptions = pick(req.query, paginationFields)
  const result = await OrderService.getAllOrder(paginationOptions, varifiyData)
  // const result = await CowService.getAllCow(filters, paginationOptions)
  sendResponse<IOrder[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Order are fetched successfully',
    meta: result.meta,
    data: result.data,
  })
})
const getSingleOrder = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params
  const { ...varifiyData } = req.user as JwtPayload
  const result = await OrderService.getSingleOrder(id, varifiyData)
  sendResponse<IOrder>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Cow is fetched successfully',
    data: result,
  })
})

// const getUpdateCow = catchAsync(async (req: Request, res: Response) => {
//   const { id } = req.params
//   const { ...cowData } = req.body
//   const result = await CowService.getUpdateCow(id, cowData)
//   sendResponse<ICow>(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: 'Cow is updated successfully',
//     data: result,
//   })
// })
const getDeleteOrder = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params
  const { ...varifiyData } = req.user as JwtPayload
  const result = await OrderService.getDeleteOrder(id, varifiyData)
  sendResponse<IOrder>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Order is deleted successfully',
    data: result,
  })
})
export const OrderController = {
  createOrder,
  getAllOrder,
  getSingleOrder,
  getDeleteOrder,
  // getUpdateCow,
}

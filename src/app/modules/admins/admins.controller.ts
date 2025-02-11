import { Request, Response } from 'express'
import catchAsync from '../../../shared/catchAsync'
import sendResponse from '../../../shared/sendResponse'
import { IAdmins } from './admins.interfaces'
import httpStatus from 'http-status'
import { AdminService } from './admins.services'
import pick from '../../../shared/pick'
import { adminFilterableFields } from './admins.constants'
import { paginationFields } from '../../../constants.ts/pagination'
import { JwtPayload } from 'jsonwebtoken'

const createAdmin = catchAsync(async (req: Request, res: Response) => {
  const { ...adminData } = req.body
  const result = await AdminService.createAdmin(adminData)
  sendResponse<IAdmins>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Admin created successfully',
    data: result,
  })
})
const getAllAdmin = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, adminFilterableFields)
  const paginationOptions = pick(req.query, paginationFields)
  const result = await AdminService.getAllAdmin(filters, paginationOptions)
  sendResponse<IAdmins[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Admin are fetched successfully',
    meta: result.meta,
    data: result.data,
  })
})
const getSingleAdmin = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params
  const result = await AdminService.getSingleAdmin(id)
  sendResponse<IAdmins>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Admin is fetched successfully',
    data: result,
  })
})

const getUpdateAdmin = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params
  const { _id: adminID } = req.user as JwtPayload
  const { ...cowData } = req.body
  const result = await AdminService.getUpdateAdmin(id, adminID, cowData)
  sendResponse<IAdmins>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Admin is updated successfully',
    data: result,
  })
})
const getDeleteAdmin = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params
  const { _id: adminID } = req.user as JwtPayload
  const result = await AdminService.getDeleteAdmin(id, adminID)
  sendResponse<IAdmins>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Admin is deleted successfully',
    data: result,
  })
})
export const AdminController = {
  createAdmin,
  getAllAdmin,
  getSingleAdmin,
  getUpdateAdmin,
  getDeleteAdmin,
}

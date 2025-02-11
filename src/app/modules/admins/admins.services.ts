import { SortOrder } from 'mongoose'
import ApiError from '../../../error/ApiError'
import { paginationHelpers } from '../../../helpers/paginationHelpers'
import { IGenericResponse } from '../../../interfaces/common'
import { IPaginationOptions } from '../../../interfaces/pagination'
import { adminSearchableFields } from './admins.constants'
import { IAdminFilters, IAdmins } from './admins.interfaces'
import { Admin } from './admins.model'
import httpStatus from 'http-status'

const createAdmin = async (payload: IAdmins): Promise<IAdmins | null> => {
  const result = await Admin.create(payload)
  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Could not create Admins')
  }
  return result
}
const getAllAdmin = async (
  filters: IAdminFilters,
  paginationOptions: IPaginationOptions,
): Promise<IGenericResponse<IAdmins[]>> => {
  const { searchTerm, ...filtersData } = filters
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions)

  const andCondition = []
  if (searchTerm) {
    andCondition.push({
      $or: adminSearchableFields.map(field => ({
        [field]: {
          $regex: searchTerm,
          $options: 'i', // case insensitive search
        },
      })),
    })
  }
  // if (Object.keys(filtersData).length) {
  //   andCondition.push({
  //     $and: Object.entries(filtersData).map(([field, value]) => ({
  //       [field]: value,
  //     })),
  //   })
  // }
  if (Object.keys(filtersData).length) {
    andCondition.push({
      $and: Object.entries(filtersData).map(([field, value]) => ({
        [field]:
          typeof value === 'string'
            ? { $regex: new RegExp(value, 'i') } // Case-insensitive for strings
            : Array.isArray(value)
              ? { $in: value } // For arrays, no case sensitivity needed
              : value, // For non-string & non-array types
      })),
    })
  }

  const sortConditions: Record<string, SortOrder> = {}
  // const sortConditions: { [key: string]: string } = {}
  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder
  }
  const whereCondition = andCondition.length > 0 ? { $and: andCondition } : {}

  const result = await Admin.find(whereCondition)
    .sort(sortConditions)
    .skip(skip)
    .limit(limit)
  const total = await Admin.countDocuments(whereCondition)
  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  }
}
const getSingleAdmin = async (id: string): Promise<IAdmins | null> => {
  const result = await Admin.findById(id)
  return result
}
const getUpdateAdmin = async (
  id: string,
  adminID: string,
  payload: Partial<IAdmins>,
): Promise<IAdmins | null> => {
  if (id !== adminID) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      'You are not authorized to update this admin!',
    )
  }
  const isExist = await Admin.findOne({ _id: id })
  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Admin not found !')
  }
  const { name, ...adminData } = payload
  const updatedAdminData: Partial<IAdmins> & Record<string, unknown> = {
    ...adminData,
  }
  // Dynamically update name
  if (name && Object.keys(name).length > 0) {
    Object.entries(name).forEach(([key, value]) => {
      const nameKey = `name.${key}`
      updatedAdminData[nameKey] = value
    })
  }
  const result = await Admin.findOneAndUpdate({ _id: id }, updatedAdminData, {
    new: true,
  })
  return result
}
const getDeleteAdmin = async (
  id: string,
  adminID: string,
): Promise<IAdmins | null> => {
  if (id !== adminID) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      'You are not authorized to update this admin!',
    )
  }
  const result = await Admin.findByIdAndDelete(id)
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Admin not found!')
  }
  return result
}
export const AdminService = {
  createAdmin,
  getAllAdmin,
  getSingleAdmin,
  getUpdateAdmin,
  getDeleteAdmin,
}

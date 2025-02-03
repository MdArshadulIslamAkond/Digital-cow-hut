import mongoose, { SortOrder } from 'mongoose'
import { IGenericResponse } from '../../../interfaces/common'
import { IPaginationOptions } from '../../../interfaces/pagination'
import httpStatus from 'http-status'

import { User } from '../user/user.model'
import { ISeller, ISellerFilters } from './seller.interface'
import { sellerSearchableFields } from './seller.constants'
import { paginationHelpers } from '../../../helpers/paginationHelpers'
import { Seller } from './seller.model'
import ApiError from '../../../error/ApiError'

const getAllSeller = async (
  filters: ISellerFilters,
  paginationOptions: IPaginationOptions,
): Promise<IGenericResponse<ISeller[]>> => {
  const { searchTerm, ...filtersData } = filters

  const andCondition = []
  if (searchTerm) {
    andCondition.push({
      $or: sellerSearchableFields.map(field => ({
        [field]: { $regex: searchTerm, $options: 'i' },
      })),
    })
  }
  if (Object.keys(filtersData).length) {
    andCondition.push({
      $and: Object.entries(filtersData).map(([field, value]) => ({
        [field]: value,
      })),
    })
  }
  const whereCondition = andCondition.length > 0 ? { $and: andCondition } : {}
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions)

  const sortConditions: Record<string, SortOrder> = {}
  // const sortConditions: { [key: string]: string } = {}
  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder
  }

  const result = await Seller.find(whereCondition)
    // .populate('academicFaculty')
    .sort(sortConditions)
    .skip(skip)
    .limit(limit)
  const total = await Seller.countDocuments(whereCondition)
  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  }
}
const getSingleSeller = async (id: string): Promise<ISeller | null> => {
  const result = await Seller.findById(id)
  // .populate('academicFaculty')
  // .populate('academicDepartment')
  // .populate('academicSemester')
  return result
}
const getUpdateSeller = async (
  id: string,
  payload: Partial<ISeller>,
): Promise<ISeller | null> => {
  // const isExist = await Student.findOne({ _id: id })
  const isExist = await Seller.findOne({ id })
  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Seller not found !')
  }
  const { name, ...sellerData } = payload
  const updatedSellerData: Partial<ISeller> & Record<string, unknown> = {
    ...sellerData,
  }

  // Dynamically update name
  if (name && Object.keys(name).length > 0) {
    Object.entries(name).forEach(([key, value]) => {
      const nameKey = `name.${key}`
      updatedSellerData[nameKey] = value
    })
  }

  const result = await Seller.findOneAndUpdate(
    // { _id: id },
    { id },
    updatedSellerData,
    {
      new: true,
    },
  )
  return result
}
const getDeleteSeller = async (id: string): Promise<ISeller | null> => {
  const session = await mongoose.startSession()
  let result = null
  try {
    session.startTransaction()
    const deleteSeller = await Seller.findOneAndDelete(
      { id },
      {
        session,
      },
    )
    if (!deleteSeller) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Seller not found !')
    }
    const deleteUser = await User.findOneAndDelete(
      { id },
      {
        session,
      },
    )
    if (!deleteUser) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User not found !')
    }
    result = deleteSeller
    await session.commitTransaction()
    session.endSession()
  } catch (err) {
    await session.abortTransaction()
    session.endSession()
    throw err
  }
  return result
}

export const SellerService = {
  getAllSeller,
  getSingleSeller,
  getUpdateSeller,
  getDeleteSeller,
}

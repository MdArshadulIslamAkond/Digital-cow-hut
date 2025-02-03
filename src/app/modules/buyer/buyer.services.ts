import mongoose, { SortOrder } from 'mongoose'
import { IGenericResponse } from '../../../interfaces/common'
import { IPaginationOptions } from '../../../interfaces/pagination'
import httpStatus from 'http-status'
import { User } from '../user/user.model'
import { paginationHelpers } from '../../../helpers/paginationHelpers'
import ApiError from '../../../error/ApiError'
import { IBuyer, IBuyerFilters } from './buyer.interfaces'
import { BuyerSearchableFields } from './buyer.constants'
import { Buyer } from './buyer.model'

const getAllBuyer = async (
  filters: IBuyerFilters,
  paginationOptions: IPaginationOptions,
): Promise<IGenericResponse<IBuyer[]>> => {
  const { searchTerm, ...filtersData } = filters

  const andCondition = []
  if (searchTerm) {
    andCondition.push({
      $or: BuyerSearchableFields.map(field => ({
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

  const result = await Buyer.find(whereCondition)
    // .populate('academicFaculty')
    .sort(sortConditions)
    .skip(skip)
    .limit(limit)
  const total = await Buyer.countDocuments(whereCondition)
  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  }
}
const getSingleBuyer = async (id: string): Promise<IBuyer | null> => {
  const result = await Buyer.findById(id)
  // .populate('academicFaculty')
  // .populate('academicDepartment')
  // .populate('academicSemester')
  return result
}
const getUpdateBuyer = async (
  id: string,
  payload: Partial<IBuyer>,
): Promise<IBuyer | null> => {
  // const isExist = await Student.findOne({ _id: id })
  const isExist = await Buyer.findOne({ id })
  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Buyer not found !')
  }
  const { name, ...buyerData } = payload
  const updatedBuyerData: Partial<IBuyer> & Record<string, unknown> = {
    ...buyerData,
  }

  // Dynamically update name
  if (name && Object.keys(name).length > 0) {
    Object.entries(name).forEach(([key, value]) => {
      const nameKey = `name.${key}`
      updatedBuyerData[nameKey] = value
    })
  }

  const result = await Buyer.findOneAndUpdate(
    // { _id: id },
    { id },
    updatedBuyerData,
    {
      new: true,
    },
  )
  return result
}
const getDeleteBuyer = async (id: string): Promise<IBuyer | null> => {
  const session = await mongoose.startSession()
  let result = null
  try {
    session.startTransaction()
    const deleteBuyer = await Buyer.findOneAndDelete(
      { id },
      {
        session,
      },
    )
    if (!deleteBuyer) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Buyer not found !')
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
    result = deleteBuyer
    await session.commitTransaction()
    session.endSession()
  } catch (err) {
    await session.abortTransaction()
    session.endSession()
    throw err
  }
  return result
}

export const BuyerService = {
  getAllBuyer,
  getSingleBuyer,
  getUpdateBuyer,
  getDeleteBuyer,
}

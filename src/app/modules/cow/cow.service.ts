import mongoose, { SortOrder } from 'mongoose'
import { IGenericResponse } from '../../../interfaces/common'
import { IPaginationOptions } from '../../../interfaces/pagination'
import httpStatus from 'http-status'
import { ICow, ICowFilters } from './cow.interface'
import { Cow } from './cow.model'
import { cowSearchableFields } from './cow.constant'
import ApiError from '../../../error/ApiError'
import { paginationHelpers } from '../../../helpers/paginationHelpers'

const createCow = async (
  payload: ICow,
  sellerID: mongoose.Types.ObjectId,
): Promise<ICow | null> => {
  let result = null
  if (sellerID === payload.seller) {
    result = (await Cow.create(payload)).populate('seller')
  }
  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Could not create Cow!')
  }
  return result
}
const getAllCow = async (
  filters: ICowFilters,
  paginationOptions: IPaginationOptions,
): Promise<IGenericResponse<ICow[]>> => {
  const { searchTerm, maxPrice, minPrice, ...filtersData } = filters
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions)

  const andCondition = []
  if (searchTerm) {
    andCondition.push({
      $or: cowSearchableFields.map(field => ({
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

  if (minPrice || maxPrice) {
    andCondition.push({ price: { $gte: minPrice, $lte: maxPrice } })
  }

  const sortConditions: Record<string, SortOrder> = {}
  // const sortConditions: { [key: string]: string } = {}
  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder
  }
  const whereCondition = andCondition.length > 0 ? { $and: andCondition } : {}

  const result = await Cow.find(whereCondition)
    .populate('seller')
    .sort(sortConditions)
    .skip(skip)
    .limit(limit)
  const total = await Cow.countDocuments(whereCondition)
  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  }
}
const getSingleCow = async (id: string): Promise<ICow | null> => {
  const result = await Cow.findById(id).populate('seller')
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Cow not found!')
  }
  return result
}
const getUpdateCow = async (
  id: string,
  sellerID: string,
  payload: Partial<ICow>,
): Promise<ICow | null> => {
  const result = await Cow.findOneAndUpdate(
    { _id: id, seller: sellerID },
    payload,
    {
      new: true,
    },
  ).populate('seller')
  if (!result) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      'Not authorized to update this cow!',
    )
  }
  return result
}
const getDeleteCow = async (
  id: string,
  sellerID: string,
): Promise<ICow | null> => {
  const result = await Cow.findOneAndDelete({ _id: id, seller: sellerID })
  if (!result) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      'Not authorized to delete this cow!',
    )
  }
  return result
}

export const CowService = {
  getAllCow,
  createCow,
  getSingleCow,
  getUpdateCow,
  getDeleteCow,
}

import ApiError from '../../../error/ApiError'
import { IOrder } from './order.interface'
import { Order } from './order.model'
import { Cow } from '../cow/cow.model'
import { Buyer } from '../buyer/buyer.model'
import mongoose, { SortOrder } from 'mongoose'
import httpStatus from 'http-status'
import { Seller } from '../seller/seller.model'
import { IPaginationOptions } from '../../../interfaces/pagination'
import { IGenericResponse } from '../../../interfaces/common'
import { paginationHelpers } from '../../../helpers/paginationHelpers'
import { JwtPayload } from 'jsonwebtoken'

const createOrder = async (payload: IOrder): Promise<IOrder | null> => {
  // 🛒 Validate Cow & Buyer
  const cow = await Cow.findById(payload.cow)
  if (!cow) throw new ApiError(httpStatus.NOT_FOUND, 'Cow not found!')

  const buyer = await Buyer.findById(payload.buyer)
  if (!buyer) throw new ApiError(httpStatus.NOT_FOUND, 'Buyer not found!')
  // ���️ Check if buyer has sufficient budget
  if (parseFloat(cow.price) > parseFloat(buyer.budget)) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Insufficient budget!')
  }
  const session = await mongoose.startSession()

  try {
    session.startTransaction()

    cow.label = 'sold out'
    const cost = parseFloat(buyer.budget) - parseFloat(cow.price)
    buyer.budget = cost.toString()
    const seller = await Seller.findById(cow.seller).session(session)
    if (!seller) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Seller not found!')
    }
    const income = parseFloat(cow.price) + parseFloat(seller.income)
    seller.income = income.toString()
    const updateSeller = await Seller.findOneAndUpdate(
      { _id: cow.seller },
      seller,
      { new: true },
    ).session(session)
    if (!updateSeller) {
      throw new ApiError(
        httpStatus.INTERNAL_SERVER_ERROR,
        'Failed to update seller!',
      )
    }
    const updateCow = await Cow.findOneAndUpdate({ _id: payload.cow }, cow, {
      new: true,
    }).session(session)
    if (!updateCow) {
      throw new ApiError(
        httpStatus.INTERNAL_SERVER_ERROR,
        'Failed to update cow!',
      )
    }
    const updateBuyer = await Buyer.findOneAndUpdate(
      { _id: payload.buyer },
      buyer,
      { new: true },
    ).session(session)
    if (!updateBuyer) {
      throw new ApiError(
        httpStatus.INTERNAL_SERVER_ERROR,
        'Failed to update buyer!',
      )
    }
    // 🔥 Order Creation
    const order = await Order.create([payload], { session })
    if (!order || order.length === 0) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Could not create Order!')
    }

    // 🛠️ Populate & Commit Transaction
    const result = await Order.findById(order[0]._id)
      .populate({
        path: 'cow',
        populate: [
          {
            path: 'seller', // Populating seller inside cow
            //   model: 'Seller',
          },
        ],
      })
      .populate('buyer')
      .session(session)

    await session.commitTransaction()
    session.endSession()

    return result
  } catch (error) {
    await session.abortTransaction()
    session.endSession()
    throw error
  }
}
const getAllOrder = async (
  // filters: ICowFilters,
  paginationOptions: IPaginationOptions,
  varifiyData: JwtPayload,
): Promise<IGenericResponse<IOrder[]>> => {
  // const { searchTerm, maxPrice, minPrice, ...filtersData } = filters
  const { role, _id: userID } = varifiyData
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions)

  // const andCondition = []
  // if (searchTerm) {
  //   andCondition.push({
  //     $or: cowSearchableFields.map(field => ({
  //       [field]: {
  //         $regex: searchTerm,
  //         $options: 'i', // case insensitive search
  //       },
  //     })),
  //   })
  // }
  // if (Object.keys(filtersData).length) {
  //   andCondition.push({
  //     $and: Object.entries(filtersData).map(([field, value]) => ({
  //       [field]: value,
  //     })),
  //   })
  // }
  // if (Object.keys(filtersData).length) {
  //   andCondition.push({
  //     $and: Object.entries(filtersData).map(([field, value]) => ({
  //       [field]:
  //         typeof value === 'string'
  //           ? { $regex: new RegExp(value, 'i') } // Case-insensitive for strings
  //           : Array.isArray(value)
  //             ? { $in: value } // For arrays, no case sensitivity needed
  //             : value, // For non-string & non-array types
  //     })),
  //   })
  // }

  // if (minPrice || maxPrice) {
  //   andCondition.push({ price: { $gte: minPrice, $lte: maxPrice } })
  // }

  const sortConditions: Record<string, SortOrder> = {}
  // const sortConditions: { [key: string]: string } = {}
  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder
  }
  // const whereCondition = andCondition.length > 0 ? { $and: andCondition } : {}
  let result: IOrder[] = []
  let total = 0
  if (role === 'admin') {
    result = await Order.find({})
      .populate({ path: 'cow', populate: [{ path: 'seller' }] })
      .populate('buyer')
      .sort(sortConditions)
      .skip(skip)
      .limit(limit)
    total = await Order.countDocuments({})
  }
  if (role === 'buyer') {
    result = await Order.find({ buyer: userID })
      .populate({ path: 'cow', populate: [{ path: 'seller' }] })
      .populate('buyer')
      .sort(sortConditions)
      .skip(skip)
      .limit(limit)
    if (!result) {
      throw new ApiError(
        httpStatus.NOT_FOUND,
        'No orders found for this buyer!',
      )
    }
    total = await Order.countDocuments({ buyer: userID })
  }
  if (role === 'seller') {
    const sellerData = await Order.find({})
      .populate({
        path: 'cow',
        match: { seller: userID },
        populate: [{ path: 'seller' }],
      })
      .populate('buyer')
      .sort(sortConditions)
      .skip(skip)
      .limit(limit)
    result = sellerData.filter(order => order.cow !== null)
    if (!result) {
      throw new ApiError(
        httpStatus.NOT_FOUND,
        'No orders found for this seller!',
      )
    }
    total = result ? result.length : 0
    // total = await Order.countDocuments({ seller: userID })
  }

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  }
}
const getSingleOrder = async (
  id: string,
  varifiyData: JwtPayload,
): Promise<IOrder | null> => {
  const { role, _id: userID } = varifiyData
  let result = null
  if (role === 'admin') {
    result = await Order.findById(id)
      .populate({ path: 'cow', populate: [{ path: 'seller' }] })
      .populate('buyer')
  }
  if (role === 'buyer') {
    result = await Order.findOne({ _id: id, buyer: userID })
      .populate({ path: 'cow', populate: [{ path: 'seller' }] })
      .populate('buyer')
  }
  if (role === 'seller') {
    const sellerData = await Order.findOne({ _id: id })
      .populate({
        path: 'cow',
        match: { seller: userID },
        populate: [{ path: 'seller' }],
      })
      .populate('buyer')
    result = sellerData && sellerData.cow ? sellerData : null
  }
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Order not found!')
  }
  return result
}
const getDeleteOrder = async (
  id: string,
  varifiyData: JwtPayload,
): Promise<IOrder | null> => {
  const { role, _id: userID } = varifiyData
  let isExist = null
  if (role === 'admin') {
    isExist = await Order.findById(id)
  }
  if (role === 'buyer') {
    isExist = await Order.findOne({ _id: id, buyer: userID })
  }
  if (role === 'seller') {
    const sellerData = await Order.findOne({ _id: id })
      .populate({
        path: 'cow',
        match: { seller: userID },
        populate: [{ path: 'seller' }],
      })
      .populate('buyer')
    isExist = sellerData && sellerData.cow ? sellerData : null
  }
  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Order not found!')
  }
  // 🛒 Validate Cow & Buyer
  const cow = await Cow.findById(isExist.cow)
  if (!cow) throw new ApiError(httpStatus.NOT_FOUND, 'Cow not found!')

  const buyer = await Buyer.findById(isExist.buyer)
  if (!buyer) throw new ApiError(httpStatus.NOT_FOUND, 'Buyer not found!')
  const session = await mongoose.startSession()

  try {
    session.startTransaction()

    cow.label = 'for sale'
    const cost = parseFloat(buyer.budget) + parseFloat(cow.price)
    buyer.budget = cost.toString()
    const seller = await Seller.findById(cow.seller).session(session)
    if (!seller) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Seller not found!')
    }
    const income = parseFloat(seller.income) - parseFloat(cow.price)
    seller.income = income.toString()
    const updateSeller = await Seller.findOneAndUpdate(
      { _id: cow.seller },
      seller,
      { new: true },
    ).session(session)
    if (!updateSeller) {
      throw new ApiError(
        httpStatus.INTERNAL_SERVER_ERROR,
        'Failed to update seller!',
      )
    }
    const updateCow = await Cow.findOneAndUpdate({ _id: isExist?.cow }, cow, {
      new: true,
    }).session(session)
    if (!updateCow) {
      throw new ApiError(
        httpStatus.INTERNAL_SERVER_ERROR,
        'Failed to update cow!',
      )
    }
    const updateBuyer = await Buyer.findOneAndUpdate(
      { _id: isExist.buyer },
      buyer,
      { new: true },
    ).session(session)
    if (!updateBuyer) {
      throw new ApiError(
        httpStatus.INTERNAL_SERVER_ERROR,
        'Failed to update buyer!',
      )
    }

    const deleteOrder = await Order.findOneAndDelete({ _id: id }, { session })

    await session.commitTransaction()
    session.endSession()

    return deleteOrder
  } catch (error) {
    await session.abortTransaction()
    session.endSession()
    throw error
  }
}
export const OrderService = {
  createOrder,
  getAllOrder,
  getSingleOrder,
  getDeleteOrder,
}

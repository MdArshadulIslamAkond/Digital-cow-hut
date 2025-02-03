import ApiError from '../../../error/ApiError'
import { IOrder } from './order.interface'
import { Order } from './order.model'
import { Cow } from '../cow/cow.model'
import { Buyer } from '../buyer/buyer.model'
import mongoose from 'mongoose'
import httpStatus from 'http-status'
import { Seller } from '../seller/seller.model'

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

export const OrderService = { createOrder }

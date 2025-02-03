import mongoose from 'mongoose'
import config from '../../../config'
import { IUser } from './user.interface'
import { User } from './user.model'
import httpStatus from 'http-status'
import { ISeller } from '../seller/seller.interface'
import ApiError from '../../../error/ApiError'
import { generatedBuyerId, generatedSellerId } from './user.utils'
import { Seller } from '../seller/seller.model'
import { IBuyer } from '../buyer/buyer.interfaces'
import { Buyer } from '../buyer/buyer.model'

const createSeller = async (
  seller: ISeller,
  user: IUser,
): Promise<IUser | null> => {
  if (!user.password) {
    user.password = config.user_default_password as string
  }
  // Set Role
  user.role = 'seller'

  let newUserAllData = null
  const session = await mongoose.startSession()
  try {
    session.startTransaction()
    // Generate Student Id
    const id = await generatedSellerId()
    user.id = id
    seller.id = id
    const newSeller = await Seller.create([seller], { session })
    if (!newSeller.length) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to create seller')
    }
    // Set Student ---> _id into user.student
    user.seller = newSeller[0]._id
    const newUser = await User.create([user], { session })
    if (!newUser.length) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to create user')
    }
    newUserAllData = newUser[0]
    await session.commitTransaction()
    session.endSession()
  } catch (error) {
    await session.abortTransaction()
    session.endSession()
    throw error
  }
  if (newUserAllData) {
    newUserAllData = await User.findOne({ id: newUserAllData.id }).populate(
      'seller',
    )
  }
  return newUserAllData
}
const createBuyer = async (
  buyer: IBuyer,
  user: IUser,
): Promise<IUser | null> => {
  if (!user.password) {
    user.password = config.user_default_password as string
  }
  // Set Role
  user.role = 'buyer'
  let newUserAllData = null
  const session = await mongoose.startSession()
  try {
    session.startTransaction()
    const id = await generatedBuyerId()
    user.id = id
    buyer.id = id
    const newBuyer = await Buyer.create([buyer], { session })
    if (!newBuyer.length) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to create Admin')
    }
    // Set Student ---> _id into user.student
    user.buyer = newBuyer[0]._id
    const newUser = await User.create([user], { session })
    if (!newUser.length) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to create Buyer')
    }
    newUserAllData = newUser[0]
    await session.commitTransaction()
    session.endSession()
  } catch (error) {
    await session.abortTransaction()
    session.endSession()
    throw error
  }
  if (newUserAllData) {
    newUserAllData = await User.findOne({ id: newUserAllData.id }).populate(
      'buyer',
    )
  }
  return newUserAllData
}

export const UserService = {
  createSeller,
  createBuyer,
}

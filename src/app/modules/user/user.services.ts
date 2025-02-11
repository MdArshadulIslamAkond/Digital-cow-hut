import mongoose, { SortOrder } from 'mongoose'
import config from '../../../config'
import { IUser, IUserUpdate } from './user.interface'
import { User } from './user.model'
import httpStatus from 'http-status'
import { ISeller } from '../seller/seller.interface'
import ApiError from '../../../error/ApiError'
import { generatedBuyerId, generatedSellerId } from './user.utils'
import { Seller } from '../seller/seller.model'
import { IBuyer } from '../buyer/buyer.interfaces'
import { Buyer } from '../buyer/buyer.model'
import { paginationHelpers } from '../../../helpers/paginationHelpers'
import { IPaginationOptions } from '../../../interfaces/pagination'
import { IGenericResponse } from '../../../interfaces/common'

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

const getAllUser = async (
  // filters: IStudentFilters,
  paginationOptions: IPaginationOptions,
): Promise<IGenericResponse<IUser[]>> => {
  // const { searchTerm, ...filtersData } = filters

  // const andCondition = []
  // if (searchTerm) {
  //   const isNumeric = !isNaN(Number(searchTerm)) // Check if searchTerm is numeric
  //   andCondition.push({
  //     $or: studentSearchableFields.map(field =>
  //       isNumeric && field === 'year'
  //         ? { [field]: Number(searchTerm) }
  //         : field !== 'year'
  //           ? { [field]: { $regex: searchTerm, $options: 'i' } }
  //           : {},
  //     ),
  //   })
  // }
  // if (Object.keys(filtersData).length) {
  //   andCondition.push({
  //     $and: Object.entries(filtersData).map(([field, value]) => ({
  //       [field]: value,
  //     })),
  //   })
  // }
  // const whereCondition = andCondition.length > 0 ? { $and: andCondition } : {}
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions)

  const sortConditions: Record<string, SortOrder> = {}
  // const sortConditions: { [key: string]: string } = {}
  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder
  }

  // const result = await User.find(whereCondition)
  const result = await User.find({})
    .populate('seller')
    .populate('buyer')
    .sort(sortConditions)
    .skip(skip)
    .limit(limit)
  const total = await User.countDocuments({})
  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  }
}
const getSingleUser = async (id: string): Promise<IUser | null> => {
  const result = await User.findById(id).populate('seller').populate('buyer')
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found !')
  }
  return result
}
const getUpdateUser = async (
  id: string,
  payload: Partial<IUserUpdate>,
): Promise<IUser | null> => {
  // const isExist = await Student.findOne({ _id: id })
  const isExist = await User.findOne({ _id: id })
  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found !')
  }
  const { role } = isExist
  const { id: sbId, role: useRole, password, ...userData } = payload
  const { name, ...Data } = userData

  const updateUser: Partial<IUser> & Record<string, unknown> = {}
  const updatedData: Partial<ISeller | IBuyer> & Record<string, unknown> = {
    ...Data,
  }
  if (sbId) {
    updatedData[id] = sbId
    updateUser[id] = sbId
  }
  if (useRole) {
    updateUser[role] = useRole
    updatedData[role] = role
  }
  if (password) {
    updateUser.password = password
  }

  // Dynamically update name
  if (name && Object.keys(name).length > 0) {
    Object.entries(name).forEach(([key, value]) => {
      const nameKey = `name.${key}`
      updatedData[nameKey] = value
    })
  }
  console.log(updatedData)
  let newUserAllData = null
  const session = await mongoose.startSession()
  try {
    session.startTransaction()
    if (role === 'seller' && isExist?.seller) {
      const updatedSeller = await Seller.findOneAndUpdate(
        { _id: isExist.seller },
        updatedData,
        { new: true, session },
      )
      if (!updatedSeller) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Seller not found !')
      }
    }

    if (role === 'buyer' && isExist?.buyer) {
      const updatedBuyer = await Buyer.findByIdAndUpdate(
        isExist?.buyer,
        updatedData,
        { new: true, session },
      )
      if (!updatedBuyer) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Buyer not found !')
      }
    }
    const result = await User.findOneAndUpdate(
      { _id: id },
      // { id },
      updateUser,
      {
        new: true,
        session,
      },
    )
    if (!result) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User not found !')
    }
    newUserAllData = result
    await session.commitTransaction() // Commit the transaction
    session.endSession() // End the session
  } catch (err) {
    await session.abortTransaction()
    session.endSession()
    throw err
  }
  if (newUserAllData) {
    newUserAllData = await User.findOne({ id: newUserAllData.id })
      .populate('seller')
      .populate('buyer')
  }
  return newUserAllData
}
const getDeleteUser = async (id: string): Promise<IUser | null> => {
  const isExist = await User.findOne({ _id: id })
  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found !')
  }
  const { role } = isExist
  const session = await mongoose.startSession()
  let result = null
  try {
    session.startTransaction()
    if (role === 'seller' && isExist?.seller) {
      const deleteSeller = await Seller.findOneAndDelete(
        { _id: isExist.seller },
        { session },
      )
      if (!deleteSeller) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Seller not found !')
      }
    }
    if (role === 'buyer' && isExist?.buyer) {
      const deleteBuyer = await Buyer.findByIdAndDelete(isExist.buyer, {
        session,
      })
      if (!deleteBuyer) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Buyer not found !')
      }
    }

    const deleteUser = await User.findOneAndDelete(
      { _id: id },
      {
        session,
      },
    )
    if (!deleteUser) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User not found !')
    }
    result = deleteUser
    await session.commitTransaction()
    session.endSession()
  } catch (err) {
    await session.abortTransaction()
    session.endSession()
    throw err
  }
  return result
}

export const UserService = {
  createSeller,
  createBuyer,
  getAllUser,
  getSingleUser,
  getUpdateUser,
  getDeleteUser,
}

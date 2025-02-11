/* eslint-disable @typescript-eslint/no-unused-vars */
import config from '../../../config'
import httpStatus from 'http-status'
import {
  ILoginUser,
  ILoginUserResponse,
  IRefreshTokenResponse,
} from './auth.interfaces'
import ApiError from '../../../error/ApiError'
import { jwtHelpers } from '../../../helpers/jwtHelper'
import { User } from '../user/user.model'
import { Admin } from '../admins/admins.model'
const loginUser = async (payload: ILoginUser): Promise<ILoginUserResponse> => {
  const { phoneNumber, password } = payload
  //   // creating instance of User for method
  //   const user = new User()
  //   // check user exists
  //   const isUserExist = await user.isUserExist(id)
  const isUserExist = await User.isUserExist(phoneNumber)
  const isUserAdminExist = await Admin.isUserExist(phoneNumber)

  if (!isUserExist && !isUserAdminExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist')
  }

  // Match password
  if (isUserExist?.password || isUserAdminExist?.password) {
    // // Importing User model for method
    // const isPasswordMatch = await user.isPasswordMatch(
    // Importing User model for statics

    const isAdminPasswordMatch = isUserAdminExist
      ? await Admin.isPasswordMatch(password, isUserAdminExist?.password)
      : false
    const isPasswordMatch = isUserExist
      ? await User.isPasswordMatch(password, isUserExist?.password)
      : false
    if (!isPasswordMatch && !isAdminPasswordMatch) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid password')
    }
  }

  //Create access token & refresh token
  let userId = null
  let userRole = null
  let userPhoneNumber = null
  if (isUserExist) {
    const { _id, role, phoneNumber } = isUserExist
    userId = _id
    userRole = role
    userPhoneNumber = phoneNumber
  }
  if (isUserAdminExist) {
    const { _id, role, phoneNumber } = isUserAdminExist
    userId = _id
    userRole = role
    userPhoneNumber = phoneNumber
  }
  // console.log(role)
  const accessToken = jwtHelpers.createToken(
    {
      _id: userId,
      role: userRole,
      phoneNumber: userPhoneNumber,
    },
    config.jwt.secret as string,
    config.jwt.expiration_in as string,
  )

  const refreshAccessToken = jwtHelpers.createToken(
    {
      _id: userId,
      role: userRole,
      phoneNumber: userPhoneNumber,
    },
    config.jwt.refresh_secret as string,
    config.jwt.refresh_expiration_in as string,
  )

  //   console.log({ accessToken, refreshAccessToken, needsPasswordChange })
  return {
    accessToken,
    refreshAccessToken,
  }
}

const refreshToken = async (token: string): Promise<IRefreshTokenResponse> => {
  // varified access token
  let varifiedToken = null
  try {
    varifiedToken = jwtHelpers.verify(
      token,
      config.jwt.refresh_secret as string,
    )
    // console.log(varifiedToken)
  } catch (err) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid refresh token')
  }
  const { phoneNumber } = varifiedToken
  // Check user exists with static parameters
  const isUserExist = await User.isUserExist(phoneNumber)
  const isUserAdminExist = await Admin.isUserExist(phoneNumber)
  if (!isUserExist && !isUserAdminExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist')
  }
  let userPhoneNumber = null
  let userRole = null
  let userId = null
  if (isUserExist) {
    const { phoneNumber, role, _id } = isUserExist
    userId = _id
    userRole = role
    userPhoneNumber = phoneNumber
  }
  if (isUserAdminExist) {
    const { phoneNumber, role, _id } = isUserAdminExist
    userId = _id
    userRole = role
    userPhoneNumber = phoneNumber
  }
  // Create new access token
  const newAccessToken = jwtHelpers.createToken(
    { _id: userId, phoneNumber: userPhoneNumber, role: userRole },
    config.jwt.secret as string,
    config.jwt.expiration_in as string,
  )
  return { accessToken: newAccessToken }
}

export const AuthService = {
  loginUser,
  refreshToken,
}

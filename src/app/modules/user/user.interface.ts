import mongoose, { Model, Types } from 'mongoose'

export type IUser = {
  _id: mongoose.Types.ObjectId
  id: string
  role: string
  password: string
  seller?: Types.ObjectId
  buyer?: Types.ObjectId
}
export type IStasicUser = {
  _id: string
  role: string
  phoneNumber: string
  password: string
}
export type IUserUpdate = {
  id: string
  role: string
  password: string
  name: {
    firstName: string
    lastName: string
  }
  phoneNumber: string
  address: string
  budget: string
  income: string
  profileImage?: string
}

// export type UserModel = Model<IUser, Record<string, unknown>>
// static methods
export type UserModel = Model<IUser> & {
  isUserExist(
    phoneNumber: string,
  ): Promise<Pick<IStasicUser, 'phoneNumber' | '_id' | 'password' | 'role'>>
  isPasswordMatch(
    givenPassword: string,
    savedPassword: string,
  ): Promise<boolean>
}

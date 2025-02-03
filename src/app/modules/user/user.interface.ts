import { Model, Types } from 'mongoose'

export type IUser = {
  id: string
  role: string
  password: string
  seller?: Types.ObjectId
  buyer?: Types.ObjectId
}

export type UserModel = Model<IUser, Record<string, unknown>>

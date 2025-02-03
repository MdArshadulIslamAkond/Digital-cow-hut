import { Model } from 'mongoose'

export type UserName = {
  firstName: string
  lastName: string
}
export type ISeller = {
  id: string
  name: UserName //embedded object
  phoneNumber: string
  address: string
  budget: string
  income: string
  profileImage?: string
}

export type SellerModel = Model<ISeller, Record<string, undefined>>

export type ISellerFilters = {
  searchTerm?: string
  id?: string
  phoneNumber?: string
  address?: string
}

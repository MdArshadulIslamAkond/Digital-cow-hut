import { Model } from 'mongoose'

export type UserName = {
  firstName: string
  lastName: string
}
export type IBuyer = {
  id: string
  name: UserName //embedded object
  phoneNumber: string
  address: string
  budget: string
  income: string
  profileImage?: string
}

export type BuyerModel = Model<IBuyer, Record<string, undefined>>

export type IBuyerFilters = {
  searchTerm?: string
  id?: string
  phoneNumber?: string
  address?: string
}

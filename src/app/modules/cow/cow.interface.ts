import { Model, Types } from 'mongoose'
import { ISeller } from '../seller/seller.interface'

export type Location =
  | 'Dhaka'
  | 'Chattogram'
  | 'Barishal'
  | 'Rajshahi'
  | 'Sylhet'
  | 'Comilla'
  | 'Rangpur'
  | 'Mymensingh'
export type CattleBreed =
  | 'Brahman'
  | 'Nellore'
  | 'Sahiwal'
  | 'Gir'
  | 'Indigenous'
  | 'Tharparkar'
  | 'Kankrej'
export enum CattleCategory {
  Dairy = 'Dairy',
  Beef = 'Beef',
  DualPurpose = 'Dual Purpose',
}
export type ICow = {
  name: string
  age: string
  price: string
  location: Location
  breed: CattleBreed
  weight: string
  label: 'for sale' | 'sold out'
  category: CattleCategory
  // category: 'Dairy' | 'Beef' | 'Dual Purpose'
  seller: Types.ObjectId | ISeller
}
export type CowModel = Model<ICow, Record<string, undefined>>
export type ICowFilters = {
  searchTerm?: string
  // age?: string
  location?: string
  breed?: string
  category?: string
  // price?: string
  maxPrice?: string
  minPrice?: string
}

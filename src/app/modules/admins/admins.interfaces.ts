import mongoose, { Model } from 'mongoose'

export type AdminsName = {
  firstName: string
  lastName: string
}
export type Role = 'admin'

export type IAdmins = {
  _id: mongoose.Types.ObjectId
  phoneNumber: string
  role: Role
  password: string
  name: AdminsName
  address: string
}

export type IAdminFilters = {
  searchTerm?: string
  location?: string
  phoneNumber?: string
  name?: string
}

// export type AdminModel = Model<IAdmins, Record<string, undefined>>
// static methods
export type AdminModel = Model<IAdmins> & {
  isUserExist(
    phoneNumber: string,
  ): Promise<Pick<IAdmins, 'phoneNumber' | '_id' | 'password' | 'role'>>
  isPasswordMatch(
    givenPassword: string,
    savedPassword: string,
  ): Promise<boolean>
}

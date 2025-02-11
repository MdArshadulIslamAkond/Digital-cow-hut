import { model, Schema } from 'mongoose'
import { AdminModel, IAdmins } from './admins.interfaces'
import { role } from './admins.constants'
import bcrypt from 'bcrypt'
import config from '../../../config'

export const adminSchema = new Schema<IAdmins, AdminModel>(
  {
    phoneNumber: { type: String, required: true, unique: true },
    role: { type: String, enum: role, required: true },
    password: {
      type: String,
      required: true,
      select: 0,
    },
    name: {
      type: {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
      },
      required: true,
    },
    address: { type: String, required: true },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  },
)

// Hash the password before saving to the database with pre hooking

adminSchema.pre('save', async function (next) {
  this.password = await bcrypt.hash(
    this.password,
    Number(config.bcrypt_salt_rounds),
  )
  next()
})

// static methods
adminSchema.statics.isUserExist = async function (
  phoneNumber: string,
): Promise<Pick<IAdmins, 'phoneNumber' | '_id' | 'password' | 'role'> | null> {
  const user = await Admin.findOne(
    { phoneNumber },
    { phoneNumber: 1, _id: 1, password: 1, role: 1 },
  ).lean()
  return user
}
adminSchema.statics.isPasswordMatch = async function (
  givenPassword: string,
  savedPassword: string,
): Promise<boolean> {
  const isMatch = await bcrypt.compare(givenPassword, savedPassword)
  return isMatch
}

export const Admin = model<IAdmins, AdminModel>('Admin', adminSchema)

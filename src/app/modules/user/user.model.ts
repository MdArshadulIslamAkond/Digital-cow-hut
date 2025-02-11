import { Schema, model } from 'mongoose'
import { IStasicUser, IUser, UserModel } from './user.interface'
import bcrypt from 'bcrypt'
import config from '../../../config'

const userSchema = new Schema<IUser, UserModel>(
  {
    _id: { type: Schema.Types.ObjectId, auto: true },
    id: {
      type: String,
      required: true,
      unique: true,
    },
    role: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      select: 0,
    },
    seller: {
      type: Schema.Types.ObjectId,
      ref: 'Seller',
    },
    buyer: {
      type: Schema.Types.ObjectId,
      ref: 'Buyer',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  },
)
// Hash the password before saving to the database with pre hooking

userSchema.pre('save', async function (next) {
  this.password = await bcrypt.hash(
    this.password,
    Number(config.bcrypt_salt_rounds),
  )
  next()
})

// static methods
userSchema.statics.isUserExist = async function (
  phoneNumber: string,
): Promise<Pick<
  IStasicUser,
  'phoneNumber' | '_id' | 'password' | 'role'
> | null> {
  const user = await User.aggregate([
    {
      $lookup: {
        from: 'sellers',
        localField: 'seller',
        foreignField: '_id',
        as: 'sellerData',
      },
    },
    {
      $lookup: {
        from: 'buyers',
        localField: 'buyer',
        foreignField: '_id',
        as: 'buyerData',
      },
    },
    {
      $match: {
        $or: [
          { 'sellerData.phoneNumber': phoneNumber },
          { 'buyerData.phoneNumber': phoneNumber },
        ],
      },
    },
    {
      $addFields: {
        extractedPhoneNumber: {
          $cond: {
            if: { $gt: [{ $size: '$sellerData' }, 0] },
            then: { $arrayElemAt: ['$sellerData.phoneNumber', 0] },
            else: { $arrayElemAt: ['$buyerData.phoneNumber', 0] },
          },
        },
        extractedId: {
          $cond: {
            if: { $gt: [{ $size: '$sellerData' }, 0] },
            then: { $arrayElemAt: ['$sellerData._id', 0] },
            else: { $arrayElemAt: ['$buyerData._id', 0] },
          },
        },
      },
    },
    {
      $project: {
        _id: '$extractedId',
        phoneNumber: '$extractedPhoneNumber',
        password: 1,
        role: 1,
      },
    },
  ])
  // console.log(user)
  return user.length > 0 ? user[0] : null
}
userSchema.statics.isPasswordMatch = async function (
  givenPassword: string,
  savedPassword: string,
): Promise<boolean> {
  const isMatch = await bcrypt.compare(givenPassword, savedPassword)
  return isMatch
}

// 3. Create a Model.
export const User = model<IUser, UserModel>('User', userSchema)

import { model, Schema } from 'mongoose'
import { BuyerModel, IBuyer } from './buyer.interfaces'

export const buyerSchema = new Schema<IBuyer, BuyerModel>(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
      },
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
    },

    address: {
      type: String,
      required: true,
    },
    budget: {
      type: String,
      required: true,
    },
    income: {
      type: String,
      required: true,
    },
    profileImage: {
      type: String,
      // required: true
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  },
)

export const Buyer = model<IBuyer, BuyerModel>('Buyer', buyerSchema)

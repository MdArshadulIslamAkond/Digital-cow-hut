import { model, Schema } from 'mongoose'
import { IOrder, OrderModel } from './order.interface'

export const orderSchema = new Schema<IOrder, OrderModel>(
  {
    cow: {
      type: Schema.Types.ObjectId,
      ref: 'Cow',
      required: true,
      unique: true,
    },
    buyer: {
      type: Schema.Types.ObjectId,
      ref: 'Buyer',
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  },
)

export const Order = model<IOrder, OrderModel>('Order', orderSchema)

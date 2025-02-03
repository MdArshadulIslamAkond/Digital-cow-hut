import { model, Schema } from 'mongoose'
import { CowModel, ICow } from './cow.interface'
import {
  // category,
  CattleBreed,
  Label,
  Location,
} from './cow.constant'
import { CattleCategory } from '../../../enums/cow'

export const CowSchema = new Schema<ICow, CowModel>(
  {
    name: { type: String, required: true },
    age: { type: String, required: true },
    price: { type: String, required: true },
    location: {
      type: String,
      enum: Location,
      required: true,
    },
    breed: {
      type: String,
      enum: CattleBreed,
      required: true,
    },
    weight: { type: String, required: true },
    label: { type: String, enum: Label, required: true, default: 'for sale' },
    category: {
      type: String,
      required: true,
      enum: Object.values(CattleCategory),
    },
    // category: { type: String, required: true, enum: category },
    seller: {
      type: Schema.Types.ObjectId,
      ref: 'Seller',
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  },
)

export const Cow = model<ICow, CowModel>('Cow', CowSchema)

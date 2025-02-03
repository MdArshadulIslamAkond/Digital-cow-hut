import { User } from './user.model'

export const findLastSellerId = async (): Promise<string | undefined> => {
  const lastSeller = await User.findOne({ role: 'seller' }, { id: 1, _id: 0 })
    .sort({ createdAt: -1 })
    .lean()
  return lastSeller?.id ? lastSeller.id.substring(2) : undefined
}

export const generatedSellerId = async (): Promise<string> => {
  const currentId =
    (await findLastSellerId()) || (0).toString().padStart(5, '0')
  let incrementedId = (parseInt(currentId) + 1).toString().padStart(5, '0')
  incrementedId = `S-${incrementedId}`
  return incrementedId
}
export const findLastBuyerId = async (): Promise<string | undefined> => {
  const lastBuyer = await User.findOne({ role: 'buyer' }, { id: 1, _id: 0 })
    .sort({ createdAt: -1 })
    .lean()
  return lastBuyer?.id ? lastBuyer.id.substring(2) : undefined
}

export const generatedBuyerId = async (): Promise<string> => {
  const currentId = (await findLastBuyerId()) || (0).toString().padStart(5, '0')
  let incrementedId = (parseInt(currentId) + 1).toString().padStart(5, '0')
  incrementedId = `B-${incrementedId}`
  return incrementedId
}

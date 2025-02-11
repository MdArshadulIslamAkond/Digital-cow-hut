import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken'

const createToken = (
  payload: Record<string, unknown>,
  secret: string,
  expiresIn: string | number,
): string => {
  const options: SignOptions = {
    expiresIn: expiresIn as SignOptions['expiresIn'],
  }
  return jwt.sign(payload, secret, options)
}
const verify = (payload: string, secret: string): JwtPayload => {
  return jwt.verify(payload, secret) as JwtPayload
}

export const jwtHelpers = {
  createToken,
  verify,
}

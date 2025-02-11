import dotenv from 'dotenv'
import path from 'path'
dotenv.config({ path: path.join(process.cwd(), '.env') })

export default {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  datrabase_url: process.env.DATABASE_URL,
  user_default_password: process.env.USER_DEFAULT_PASS,
  bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
  jwt: {
    secret: process.env.JWT_SECRET_KEY,
    expiration_in: process.env.JWT_EXPIRES_IN,
    refresh_secret: process.env.JWT_REFRESH_SECRET_KEY,
    refresh_expiration_in: process.env.JWT_REFRESH_EXPIRES_IN,
  },
}

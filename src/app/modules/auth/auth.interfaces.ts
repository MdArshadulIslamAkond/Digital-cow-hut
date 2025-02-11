export type ILoginUser = {
  phoneNumber: string
  password: string
}

export type ILoginUserResponse = {
  accessToken: string
  refreshAccessToken?: string
  // needsPasswordChange: boolean
}
export type IRefreshTokenResponse = {
  accessToken: string
}

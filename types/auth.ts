
export type ShopResponse = {
  name: string,
  username: string,
  avatar_url: string,
  whatsapp_number: string,
  description: string,
  phone_number: string,
  balance: number,
  order_count: number,
  cover_url: string,
  affiliate_code: string,
  id: number,
  user: UserResponse
}

export type UserResponse = {
  id: number,
  first_name: string,
  name: string,
  phone_number: string,
  shops: ShopResponse[]
}

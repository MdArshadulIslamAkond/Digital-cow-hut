import express from 'express'
import { UserRoutes } from '../modules/user/user.route'
import { SellerRoutes } from '../modules/seller/seller.route'
import { BuyerRoutes } from '../modules/buyer/buyer.route'
import { orderRoutes } from '../modules/order/order.routers'
import { CowRoutes } from '../modules/cow/cow.routers'
const router = express.Router()
const moduleRoutes = [
  {
    path: '/users',
    route: UserRoutes,
  },
  {
    path: '/seller',
    route: SellerRoutes,
  },
  {
    path: '/buyer',
    route: BuyerRoutes,
  },
  {
    path: '/cow',
    route: CowRoutes,
  },
  {
    path: '/order',
    route: orderRoutes,
  },
]

moduleRoutes.forEach(route => {
  router.use(route.path, route.route)
})

export default router

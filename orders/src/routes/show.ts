import express, { Request, Response } from 'express'
// import { Order } from '../models/order'

const router = express.Router()

router.get('/api/orders/:orderId', async (req: Request, res: Response) => {
  const orders = {} //await Order.find({})

  res.send(orders)
})

export { router as showOrderRouter }
//
//---------------------------------------------------------------------------------------------
//

// import express, { Request, Response } from 'express'
// import { NotFoundError } from '@kodrclub-orders/common'
// import { Order } from '../models/order'

// const router = express.Router()

// router.get('/api/orders/:id', async (req: Request, res: Response) => {
//   const order = await Order.findById(req.params.id)
//   if (!order) {
//     throw new NotFoundError()
//   }

//   res.send(order)
// })

// export { router as showOrderRouter }

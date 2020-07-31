import express, { Request, Response } from 'express'
// import { Order } from '../models/order'

const router = express.Router()

router.post('/api/orders/', async (req: Request, res: Response) => {
  const orders = {} //await Order.find({})

  res.send(orders)
})

export { router as newOrderRouter }
//
//---------------------------------------------------------------------------------------------
//

// import express, { Request, Response } from 'express'
// import { body } from 'express-validator'
// import { natsWrapper } from '../nats-wrapper'
// import { requireAuth, validateRequest } from '@kodrclub-orders/common'
// import { Order } from '../models/order'
// import { OrderCreatedPublisher } from '../events/publishers/order-created-publisher'

// const router = express.Router()

// router.post(
//   '/api/orders',
//   requireAuth,
//   [
//     body('title').not().isEmpty().withMessage('Title is required'),
//     body('price')
//       .isFloat({ gt: 0 })
//       .withMessage('Price must be greater than 0'),
//   ],
//   validateRequest,
//   async (req: Request, res: Response) => {
//     const { title, price } = req.body

//     const order = Order.build({
//       title,
//       price,
//       userId: req.currentUser!.id,
//     })
//     await order.save()
//     await new OrderCreatedPublisher(natsWrapper.client).publish({
//       id: order.id,
//       title: order.title,
//       price: order.price,
//       userId: order.userId,
//     })

//     res.status(201).send(order)
//   }
// )

// export { router as newOrderRouter }

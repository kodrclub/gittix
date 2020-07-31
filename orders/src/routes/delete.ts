import express, { Request, Response } from 'express'
// import { Order } from '../models/order'

const router = express.Router()

router.post('/api/orders/:orderId', async (req: Request, res: Response) => {
  const orders = {} //await Order.find({})

  res.send(orders)
})

export { router as deleteOrderRouter }
//
//---------------------------------------------------------------------------------------------
//

// import express, { Request, Response } from 'express'
// import { body } from 'express-validator'
// import { natsWrapper } from '../nats-wrapper'
// import {
//   NotFoundError,
//   NotAuthorizedError,
//   requireAuth,
//   validateRequest,
// } from '@kodrclub-orders/common'
// import { Order } from '../models/order'
// import { OrderUpdatedPublisher } from '../events/publishers/order-updated-publisher'

// const router = express.Router()

// router.put(
//   '/api/orders/:id',
//   requireAuth,
//   [
//     body('title').not().isEmpty().withMessage('Title is required'),
//     body('price')
//       .isFloat({ gt: 0 })
//       .withMessage('Price must be greater than 0'),
//   ],
//   validateRequest,
//   async (req: Request, res: Response) => {
//     const order = await Order.findById(req.params.id)
//     if (!order) {
//       throw new NotFoundError()
//     }

//     if (order.userId !== req.currentUser!.id) {
//       throw new NotAuthorizedError()
//     }

//     order.set({
//       title: req.body.title,
//       price: req.body.price,
//     })
//     await order.save()
//     await new OrderUpdatedPublisher(natsWrapper.client).publish({
//       id: order.id,
//       title: order.title,
//       price: order.price,
//       userId: order.userId,
//     })

//     res.send(order)
//   }
// )

// export { router as updateOrderRouter }

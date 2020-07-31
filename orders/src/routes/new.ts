// import express, { Request, Response } from 'express'
// // import { Order } from '../models/order'

// const router = express.Router()

// router.post('/api/orders/', async (req: Request, res: Response) => {
//   const orders = {} //await Order.find({})

//   res.send(orders)
// })

// export { router as newOrderRouter }
// //
//---------------------------------------------------------------------------------------------
//

import express, { Request, Response } from 'express'
import { body } from 'express-validator'
// import { natsWrapper } from '../nats-wrapper'
import { requireAuth, validateRequest } from '@kc-gittix/common'
// import { Order } from '../models/order'
// import { OrderCreatedPublisher } from '../events/publishers/order-created-publisher'

const router = express.Router()

router.post(
  '/api/orders',
  requireAuth,
  [body('ticketId').not().isEmpty().withMessage('TicketId is required')],
  validateRequest,
  async (req: Request, res: Response) => {
    res.send({})
    // const { title, price } = req.body

    // const order = Order.build({
    //   title,
    //   price,
    //   userId: req.currentUser!.id,
    // })
    // await order.save()
    // await new OrderCreatedPublisher(natsWrapper.client).publish({
    //   id: order.id,
    //   title: order.title,
    //   price: order.price,
    //   userId: order.userId,
    // })

    // res.status(201).send(order)
  }
)

export { router as newOrderRouter }

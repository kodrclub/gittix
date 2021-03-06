import express, { Request, Response } from 'express'
import { body } from 'express-validator'
import { natsWrapper } from '../nats-wrapper'
import {
  NotFoundError,
  NotAuthorizedError,
  requireAuth,
  validateRequest,
} from '@kc-gittix/common'
import { Order, OrderStatus } from '../models/order'
import { OrderCancelledPublisher } from '../events/publishers/order-cancelled-publisher'

const router = express.Router()

router.delete(
  //maybe should be put or patch but whatever
  '/api/orders/:orderId',
  requireAuth,
  async (req: Request, res: Response) => {
    const order = await Order.findById(req.params.orderId)
    if (!order) {
      throw new NotFoundError()
    }
    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError()
    }

    order.set({
      status: OrderStatus.Cancelled,
    })
    await order.save()
    await new OrderCancelledPublisher(natsWrapper.client).publish({
      id: order.id,
      ticket: {
        id: order.ticket.id,
      },
      version: order.ticket.version,
    })

    res.status(204).send(order)
  }
)

export { router as deleteOrderRouter }

import express, { Request, Response } from 'express'
import { body } from 'express-validator'
// import { natsWrapper } from '../nats-wrapper'
import {
  BadRequestError,
  NotAuthorizedError,
  NotFoundError,
  requireAuth,
  validateRequest,
  OrderStatus,
} from '@kc-gittix/common'
// import { Charge } from '../models/charge'
// import { ChargeCreatedPublisher } from '../events/publishers/charge-created-publisher'
import { Order } from '../models/order'
import { stripe } from '../stripe'

const router = express.Router()

router.post(
  '/api/payments',
  requireAuth,
  [
    body('token').not().isEmpty().withMessage('Token is required'),
    body('orderId').not().isEmpty().withMessage('Order id is required'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { token, orderId } = req.body

    const order = await Order.findById(orderId)
    if (!order) {
      throw new NotFoundError()
    }

    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError()
    }

    if (order.status === OrderStatus.Cancelled) {
      throw new BadRequestError('Cannot pay for a cancelled order')
    }

    await stripe.charges.create({
      currency: 'eur',
      amount: order.price * 100,
      source: token,
    })

    res.status(201).send({ success: true })

    // await charge.save()
    // await new ChargeCreatedPublisher(natsWrapper.client).publish({
    //   id: charge.id,
    //   title: charge.title,
    //   price: charge.price,
    //   userId: charge.userId,
    //   version: charge.version,
    // })

    // res.status(201).send(charge)
  }
)

export { router as newChargeRouter }

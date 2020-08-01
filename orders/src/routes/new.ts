import express, { Request, Response } from 'express'
import { body } from 'express-validator'
// import { natsWrapper } from '../nats-wrapper'
import {
  requireAuth,
  validateRequest,
  NotFoundError,
  OrderStatus,
  BadRequestError,
} from '@kc-gittix/common'
import { Order } from '../models/order'
import { Ticket } from '../models/ticket'
import { EDESTADDRREQ } from 'constants'
// import { OrderCreatedPublisher } from '../events/publishers/order-created-publisher'

const router = express.Router()
const EXPIRATION_WINDOW_SECONDS = 15 * 6

router.post(
  '/api/orders',
  requireAuth,
  [body('ticketId').not().isEmpty().withMessage('TicketId is required')],
  validateRequest,
  async (req: Request, res: Response) => {
    const { ticketId } = req.body

    // find in the database the ticket the user is trying to order
    const ticket = await Ticket.findById(ticketId)
    if (!ticket) {
      throw new NotFoundError()
    }

    // make sure that the ticket is not already reserved
    const isReserved = await ticket.isReserved()
    if (isReserved) {
      throw new BadRequestError('Ticket is already reserved')
    }

    // calculate an expiration date for the order
    const expiration = new Date()
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS)

    // build the order and save it to the db
    const order = Order.build({
      userId: req.currentUser!.id,
      status: OrderStatus.Created,
      expiresAt: expiration,
      ticket,
    })

    // publish an event saying that the ordar

    res.status(201).send(order)
  }
)

export { router as newOrderRouter }

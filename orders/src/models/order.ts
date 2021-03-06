import mongoose from 'mongoose'
import { OrderStatus } from '@kc-gittix/common'
import { TicketDoc } from './ticket'
import { updateIfCurrentPlugin } from 'mongoose-update-if-current'

/*
Describes the properties required to create a new order
*/
interface OrderAttrs {
  expiresAt: Date
  status: OrderStatus
  ticket: TicketDoc
  userId: string
}
/*
Describes the properties that a Order Document has
*/
interface OrderDoc extends mongoose.Document {
  expiresAt: Date
  status: OrderStatus
  ticket: TicketDoc
  userId: string
  version: number
}
/*
Describes the properties that a Order Model has
*/
interface OrderModel extends mongoose.Model<OrderDoc> {
  build(attrs: OrderAttrs): OrderDoc
}

const orderSchema = new mongoose.Schema(
  {
    expiresAt: {
      type: mongoose.Schema.Types.Date,
      required: false,
    },
    status: {
      type: String,
      required: true,
      enum: Object.values(OrderStatus),
      default: OrderStatus.Created,
    },
    ticket: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ticket',
    },
    userId: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id
        delete ret._id
        delete ret.__v
      },
    },
  }
)
orderSchema.set('versionKey', 'version')
orderSchema.plugin(updateIfCurrentPlugin)

orderSchema.statics.build = (attrs: OrderAttrs) => {
  return new Order(attrs)
}

const Order = mongoose.model<OrderDoc, OrderModel>('Order', orderSchema)

export { Order, OrderStatus }

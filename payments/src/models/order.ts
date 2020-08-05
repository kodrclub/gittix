import mongoose from 'mongoose'
import { OrderStatus } from '@kc-gittix/common'
// import { TicketDoc } from './ticket'
import { updateIfCurrentPlugin } from 'mongoose-update-if-current'

/*
Describes the properties required to create a new order
*/
interface OrderAttrs {
  id: string
  price: number
  status: OrderStatus
  userId: string
  version: number
}
/*
Describes the properties that a Order Document has
*/
interface OrderDoc extends mongoose.Document {
  price: number
  status: OrderStatus
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
    price: {
      type: Number,
      ref: 'Ticket',
    },
    status: {
      type: String,
      required: true,
      enum: Object.values(OrderStatus),
      default: OrderStatus.Created,
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
  return new Order({
    _id: attrs.id,
    price: attrs.price,
    status: attrs.status,
    userId: attrs.userId,
    version: attrs.version,
  })
}

const Order = mongoose.model<OrderDoc, OrderModel>('Order', orderSchema)

export { Order }

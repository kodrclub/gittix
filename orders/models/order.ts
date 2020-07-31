import mongoose from 'mongoose'

/*
Describes the properties required to create a new user
*/
interface OrderAttrs {
  userId: string
  status: string
  expiresAt: Date
  ticket: TicketDoc
}
/*
Describes the properties that a Order Document has
*/
interface OrderDoc extends mongoose.Document {
  userId: string
  status: string
  expiresAt: Date
  ticket: TicketDoc
}
/*
Describes the properties that a Order Model has
*/
interface OrderModel extends mongoose.Model<OrderDoc> {
  build(attrs: OrderAttrs): OrderDoc
}

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: mongoose.Schema.Types.Date,
      required: false,
    },
    ticket: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ticket',
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

orderSchema.statics.build = (attrs: OrderAttrs) => {
  return new Order(attrs)
}

const Order = mongoose.model<OrderDoc, OrderModel>('Order', orderSchema)

export { Order }

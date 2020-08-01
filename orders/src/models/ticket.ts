import mongoose from 'mongoose'
import { Order, OrderStatus } from './order'

/*
Describes the properties required to create a new user
*/
interface TicketAttrs {
  title: string
  price: number
  // userId: string
}
/*
Describes the properties that a Ticket Document has
*/
export interface TicketDoc extends mongoose.Document {
  title: string
  price: number
  // userId: string
  isReserved(): Promise<boolean>
}
/*
Describes the properties that a Ticket Model has
*/
interface TicketModel extends mongoose.Model<TicketDoc> {
  build(attrs: TicketAttrs): TicketDoc
}

const ticketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    // userId: {
    //   type: String,
    //   required: true,
    // },
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

ticketSchema.statics.build = (attrs: TicketAttrs) => {
  return new Ticket(attrs)
}

ticketSchema.methods.isReserved = async function () {
  // this === the Ticket document
  const existingOrder = await Order.findOne({
    ticket: this,
    status: {
      $in: [
        OrderStatus.Created,
        OrderStatus.AwaitingPayment,
        OrderStatus.Complete,
        //
      ],
    },
  })

  return !!existingOrder
}

const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema)

export { Ticket }
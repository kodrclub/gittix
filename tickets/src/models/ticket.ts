import mongoose from 'mongoose'
import { updateIfCurrentPlugin } from 'mongoose-update-if-current'
/*
Describes the properties required to create a new user
*/
interface TicketAttrs {
  price: number
  title: string
  userId: string
}

/*
Describes the properties that a Ticket Document has
*/
interface TicketDoc extends mongoose.Document {
  orderId?: string
  price: number
  title: string
  userId: string
  version: number
}

/*
Describes the properties that a Ticket Model has
*/
interface TicketModel extends mongoose.Model<TicketDoc> {
  build(attrs: TicketAttrs): TicketDoc
}

const ticketSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: false,
    },
    price: {
      type: Number,
      required: true,
    },
    title: {
      type: String,
      required: true,
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
ticketSchema.set('versionKey', 'version')
ticketSchema.plugin(updateIfCurrentPlugin)

ticketSchema.statics.build = (attrs: TicketAttrs) => {
  return new Ticket(attrs)
}

const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema)

export { Ticket }

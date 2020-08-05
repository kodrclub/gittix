import mongoose from 'mongoose'
import { PaymentStatus } from '@kc-gittix/common'
// import { TicketDoc } from './ticket'
import { updateIfCurrentPlugin } from 'mongoose-update-if-current'

/*
Describes the properties required to create a new payment
*/
interface PaymentAttrs {
  orderId: string
  stripeId: string
}
/*
Describes the properties that a Payment Document has
*/
interface PaymentDoc extends mongoose.Document {
  orderId: string
  stripeId: string
}
/*
Describes the properties that a Payment Model has
*/
interface PaymentModel extends mongoose.Model<PaymentDoc> {
  build(attrs: PaymentAttrs): PaymentDoc
}

const paymentSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
    },
    stripeId: {
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
paymentSchema.set('versionKey', 'version')
paymentSchema.plugin(updateIfCurrentPlugin)

paymentSchema.statics.build = (attrs: PaymentAttrs) => {
  return new Payment({
    _id: attrs.id,
    orderId: attrs.orderId,
    stripeId: attrs.stripeId,
  })
}

const Payment = mongoose.model<PaymentDoc, PaymentModel>(
  'Payment',
  paymentSchema
)

export { Payment }

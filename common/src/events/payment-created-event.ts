import { Subjects } from './subjects'

export interface PaymentCreatedEvent {
  subject: Subjects.OrderCreated
  data: {
    id: string
    orderId: string
    stripeId: string
  }
}

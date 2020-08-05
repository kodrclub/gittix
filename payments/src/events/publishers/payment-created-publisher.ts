import { Publisher, Subjects, PaymentCreatedEvent } from '@kc-gittix/common'

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated
}

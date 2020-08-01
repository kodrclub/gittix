import { Publisher, OrderCancelledEvent, Subjects } from '@kc-gittix/common'

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled
}

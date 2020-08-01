import { Publisher, OrderCreatedEvent, Subjects } from '@kc-gittix/common'

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated
}

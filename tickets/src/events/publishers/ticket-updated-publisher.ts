import { Publisher, Subjects, TicketUpdatedEvent } from '@kc-gittix/common'

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated
}

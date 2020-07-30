import {
  Publisher,
  Subjects,
  TicketUpdatedEvent,
} from '@kodrclub-tickets/common'

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated
}

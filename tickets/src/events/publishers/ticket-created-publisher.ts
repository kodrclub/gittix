import {
  Publisher,
  Subjects,
  TicketCreatedEvent,
} from '@kodrclub-tickets/common'

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated
}

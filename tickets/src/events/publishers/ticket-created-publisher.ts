import { Publisher, Subjects, TicketCreatedEvent } from '@kc-gittix/common'

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated
}

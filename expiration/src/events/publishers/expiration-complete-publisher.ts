import { Publisher, Subjects, ExpirationCompleteEvent } from '@kc-gittix/common'

export class ExpirationCompletePublisher extends Publisher<
  ExpirationCompleteEvent
> {
  readonly subject = Subjects.ExpirationComplete
}

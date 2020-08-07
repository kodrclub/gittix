import useRequest from '../../hooks/use-request'
import Router from 'next/router'

const TicketShow = ({ ticket }) => {
  const { doRequest, errors } = useRequest({
    url: '/api/orders',
    method: 'post',
    body: {
      ticketId: ticket.id,
    },
    onSuccess: (order) =>
      Router.push('/orders/[orderId]', `/orders/${order.id}`),
  })

  const purchaseButton = !ticket.orderId ? (
    <button onClick={() => doRequest()} className="btn btn-primary">
      Purchase
    </button>
  ) : (
    <div>This ticket has already been purchased</div>
  )

  return (
    <div>
      <h1>{ticket.title}</h1>
      <h4>{ticket.price}</h4>
      {purchaseButton}
    </div>
  )
}

TicketShow.getInitialProps = async (context, client) => {
  const { ticketId } = context.query

  const { data } = await client.get(`/api/tickets/${ticketId}`)

  return { ticket: data }
}

export default TicketShow

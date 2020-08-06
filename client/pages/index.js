import buildClient from '../api/build-client'
import Link from 'next/link'

const LandingPage = ({ currentUser, tickets }) => {
  const ticketList = tickets.map((ticket) => {
    return (
      <tr key={ticket.id}>
        <td key="a">
          <Link href="/tickets/[itcketId]" as={`/tickets/${ticket.id}`}>
            <a>{ticket.title}</a>
          </Link>
        </td>
        <td key="b">
          {ticket.price}
          <br />
          {ticket.id}
        </td>
      </tr>
    )
  })
  return (
    <div>
      <h1>Tickets</h1>
      <table className="table">
        <thead>
          <tr key="header">
            <th>Title</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>{ticketList}</tbody>
      </table>
    </div>
  )
}

LandingPage.getInitialProps = async (context, client, currentUser) => {
  const { data } = await client.get('/api/tickets')

  return { tickets: data }
}

export default LandingPage

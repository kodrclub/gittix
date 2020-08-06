import buildClient from '../api/build-client'
import Link from 'next/link'

const LandingPage = ({ currentUser, tickets }) => {
  const ticketList = tickets.map((ticket) => {
    const href = `/tickets/${ticket.id}`
    return (
      <tr key={ticket.lid}>
        <td>
          <Link href={href}>
            <a>{ticket.title}</a>
          </Link>
        </td>
        <td>
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
          <tr>
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

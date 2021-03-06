import Router from 'next/router'
import StripeCheckout from 'react-stripe-checkout'
import { useEffect, useState } from 'react'
import useRequest from '../../hooks/use-request'

const OrderShow = ({ order, currentUser }) => {
  const [timeLeft, setTimeLeft] = useState(0)

  const { doRequest, errors } = useRequest({
    url: '/api/payments',
    method: 'post',
    body: {
      orderId: order.id,
    },

    onSuccess: (payment) => Router.push('/orders'),
  })

  useEffect(() => {
    const findTimeLeft = () => {
      const msLeft = new Date(order.expiresAt) - new Date()
      setTimeLeft(Math.round(msLeft / 1000))
    }

    findTimeLeft()
    const timerId = setInterval(findTimeLeft, 1000)

    return () => {
      clearInterval(timerId)
    }
  }, [order]) //the [] means we'll call clearInterval if we navigate away from this page

  if (timeLeft <= 0) {
    return <div>Order expired</div>
  }

  //TODO: use environment variable tied to k8s secret for stripeKey
  return (
    <div>
      <p>Time left to pay: {timeLeft} seconds</p>
      <StripeCheckout
        token={({ id }) => {
          doRequest({ token: id })
        }}
        stripeKey="pk_test_51HCm32CTjBqYzeLkajzkxejPX1sCOcd7y24ZQD8sM6qJZ6Nz2xDgyhgYghHKwsjHWzkf8NRqJLROJ1ZZ18eSQGxH00wujmI0pB"
        amount={order.ticket.price * 100}
        email={currentUser.email}
      />
      {errors}
    </div>
  )

  return (
    <div>
      <div>PURHCASED</div>
    </div>
  )
} //////////////////////////////////////

OrderShow.getInitialProps = async (context, client) => {
  const { orderId } = context.query

  const { data } = await client.get(`/api/orders/${orderId}`)

  return { order: data }
}

export default OrderShow

import { useEffect, useState } from 'react'

const OrderShow = ({ order }) => {
  const [timeLeft, setTimeLeft] = useState(0)

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

  return <div>Time left to pay: {timeLeft} seconds</div>
  // const { doRequest, errors } = useRequest({
  //   url: '/api/orders',
  //   method: 'post',
  //   body: {
  //     orderId: order.id,
  //   },
  //   onSuccess: (order) => console.log(order),
  // })

  return (
    <div>
      <div>PURHCASED</div>
    </div>
  )
}

OrderShow.getInitialProps = async (context, client) => {
  const { orderId } = context.query

  const { data } = await client.get(`/api/orders/${orderId}`)

  return { order: data }
}

export default OrderShow

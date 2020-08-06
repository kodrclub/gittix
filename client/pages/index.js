import buildClient from '../api/build-client'

const LandingPage = ({ currentUser }) => {
  return currentUser ? (
    <h1>Your are signed in as {currentUser.email}</h1>
  ) : (
    <h1>You are not signed in</h1>
  )
}

LandingPage.getInitialProps = async (context, client, currentUser) => {
  return {}
  // const { data } = await buildClient(context).get('/api/users/current-user')
  // return data
}

export default LandingPage

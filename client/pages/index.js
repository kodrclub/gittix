import buildClient from '../api/build-client'

const LandingPage = ({ currentUser }) => {
  return currentUser ? (
    <h1>Your are signed in as {currentUser}</h1>
  ) : (
    <h1>You are not signed in</h1>
  )
}

LandingPage.getInitialProps = async (context) => {
  console.log('***-----------------***')
  console.log('*** GETINITIALPROPS ***')
  console.log('***-----------------***')
  // console.log(context.req.headers)

  const { data } = await buildClient(context).get('/api/users/current-user')
  return data
}

export default LandingPage

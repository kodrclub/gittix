import axios from 'axios'

const LandingPage = ({ currentUser }) => {
  return (
    <div className="wrap">
      <h1>Landing Page</h1>
      <div>*{currentUser}*</div>
    </div>
  )
  console.log('///////////////')
  console.log(currentUser)
  console.log('///////////////')
}

LandingPage.getInitialProps = async ({ req }) => {
  console.log('***-----------------***')
  console.log('*** GETINITIALPROPS ***')
  console.log('***-----------------***')
  console.log(req.headers)

  if (typeof window === 'undefined') {
    //server
    const {
      data,
    } = await axios.get(
      'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/users/current-user',
      { headers: req.headers }
    )
    return data
  } else {
    //browser
    const { data } = await axios.get('/api/users/current-user')
    return data
  }
  // return {}
}

export default LandingPage

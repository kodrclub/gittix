import 'bootstrap/dist/css/bootstrap.css'
import buildClient from '../api/build-client'
import Header from '../components/header'

const AppComponent = ({ Component, pageProps, currentUser }) => {
  return (
    <div className="wrapper">
      <Header />
      <Component {...pageProps} />
    </div>
  )
}

AppComponent.getInitialProps = async (appContext) => {
  console.log('***---------------------***')
  console.log('*** APP GETINITIALPROPS ***')
  console.log('***---------------------***')
  // console.log(context.req.headers)

  const client = buildClient(appContext.ctx)
  const { data } = await client.get('/api/users/current-user')

  let pageProps = {}
  if (appContext.Component.getInitialProps) {
    pageProps = await appContext.Component.getInitialProps(appContext.ctx)
  }

  console.log(pageProps)
  return {
    pageProps,
    ...data,
  }
}

export default AppComponent

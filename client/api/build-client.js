import axios from 'axios'

export default ({ req }) => {
  const runningOnServer = typeof window === 'undefined'
  const axiosDef = runningOnServer
    ? {
        baseURL:
          'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
        headers: req.headers,
      }
    : { baseURL: '/' }

  axios.defaults.withCredentials = true /////////
  axiosDef.withCredentials = true /////////
  console.log('=================================') /////////
  console.log(axiosDef) /////////
  console.log('=================================') /////////

  return axios.create(axiosDef)
}

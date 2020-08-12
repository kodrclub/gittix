import axios from 'axios'

const Client = ({ req }) => {
  const baseURL =
    process.env.BASE_URL ||
    'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local'
  const runningOnServer = typeof window === 'undefined'
  const axiosDef = runningOnServer
    ? {
        baseURL,
        headers: req.headers,
      }
    : { baseURL: '/' }

  return axios.create(axiosDef)
}

export default Client

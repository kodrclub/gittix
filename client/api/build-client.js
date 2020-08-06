import axios from 'axios'

const Client = ({ req }) => {
  const runningOnServer = typeof window === 'undefined'
  const axiosDef = runningOnServer
    ? {
        baseURL:
          'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
        headers: req.headers,
      }
    : { baseURL: '/' }

  return axios.create(axiosDef)
}

export default Client

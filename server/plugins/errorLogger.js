module.exports = {
  name: 'ErrorLogger',
  register: server => {
    server.ext({
      type: 'onPreResponse',
      method: (request, h) => {
        if (request.response.isServer) {
          console.error('response.message', request.response.message)
          console.error('response.data', request.response.data)
          console.error('response.stack', request.response.stack.split('\n'))
        }
        return h.continue
      }
    })
  }
}

module.exports = [
  {
    path: '/notifications/{userId}',
    method: 'GET',
    config: require('./fetch')
  },
  {
    path: '/notifications/{userId}',
    method: 'PUT',
    config: require('./update')
  }
]
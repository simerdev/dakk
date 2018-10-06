module.exports = [
  {
    path: '/user',
    method: 'GET',
    config: require('./fetch')
  },
  {
    path: '/user/{userId}',
    method: 'PUT',
    config: require('./update')
  }
]
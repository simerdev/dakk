module.exports = [
  {
    path: '/draft/{userName}/{dakkId}',
    method: 'GET',
    config: require('./fetch')
  }
]
module.exports = [
  {
    path: '/dakk',
    method: 'GET',
    config: require('./fetch')
  },
  {
    path: '/dakk',
    method: 'POST',
    config: require('./create')
  },
  {
    path: '/dakk/{dakkId}',
    method: 'GET',
    config: require('./fetchDetials')
  }
]
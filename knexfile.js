'use strict'

const Config = require('./server/config')

module.exports = { ...Config.get('/db') }

var router = module.exports = { }

var express = require('express')
var app = express()
var server = app.listen(8080)
var errorHandler = require('./errorHandler.js')
errorHandler.with(app, server)
var watcher = require('./watcher.js')

app.use(function (req, res) {
  // req.headers, req.url, params, query, body
  var template = router.pickEntryPoint(req.url)
  var write = function (txt) {
    res.write(txt.toString())
  }

  eval(template)(function (result) { // eslint-disable-line
    res.end(result)
  })
})

router.pickEntryPoint = function (url) {
  return Object.keys(watcher.templates).filter(possible => {
    return url === possible
  }).map(match => {
    return watcher.templates[match]
  })[0] || watcher['404'] || router['404']
}

router['404'] = function () {
  return '404 Resource not found'
}

var errorHandler = module.exports = { }
var cluster = require('cluster')
cluster.worker = cluster.worker || { id: 0 }

errorHandler.with = function (app, server) {
  errorHandler.server = server
  errorHandler.app = app

  var pendingExceptions = 0
  var retries = 0
  var logAndExit = function (message) {
    console.log('server shutting down - ' + message)
    process.exit(1)  // eslint-disable-line no-process-exit
  }
  var watchOpenConnections = function (err) {
    errorHandler.server.getConnections(function (mehErr2, count) {
      console.log('Waiting for connections to close - ' + count + ' still open')
      if (count <= pendingExceptions) {
        return logAndExit('only connections left open have raised uncaughtExceptions', err)
      }
      if (retries++ > 30) {
        return logAndExit('server close event not fired within timeout duration', err)
      }
      return setTimeout(watchOpenConnections, 1000)
    })
  }
  process.on('uncaughtException', function (err) {
    pendingExceptions += 1
    console.error('Uncaught exception!\n', err.stack)
    if (errorHandler.server.connections < pendingExceptions) {
      return logAndExit('no connections to close')
    }
    if (cluster.isWorker) {
      cluster.worker.disconnect()
    }
    errorHandler.server.close()
    return watchOpenConnections(err)
  })
  errorHandler.app.on('close', function () {
    return logAndExit('all connections closed OK')
  })
}

const watcher = module.exports = { }

const fs = require('fs')
const path = require('path')
const templater = require('./templater.js')
const cwd = process.cwd()

watcher.templates = { }

watcher.recurse = function (folder) {
  const aFolder = path.join(cwd, folder)
  fs.readdirSync(aFolder).forEach(file => {
    let filePath = path.join(folder, file)
    let aFilePath = path.join(cwd, filePath)
    if (fs.statSync(aFilePath).isDirectory()) {
      return watcher.recurse(filePath)
    }
    watcher.templates[filePath] = templater.compile(aFilePath)
  })
  fs.watch(aFolder, (eventType, file) => {
    if (!file) return
    let filePath = path.join(folder, file)
    let aFilePath = path.join(cwd, filePath)
    watcher.templates[filePath] = templater.compile(aFilePath)
  })
}
watcher.recurse('/')
// console.log(watcher.templates)

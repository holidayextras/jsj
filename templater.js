var templater = module.exports = { }

var fs = require('fs')

templater.compile = function (filePath) {
  var template = fs.readFileSync(filePath).toString()
  // console.log(template);
  template = template.split(/(<\?jsa?)|(\?>)|(<\?=)/g).filter(a => a)
  // console.log(template);

  let async = false
  let vars = false
  let terminators = [ ]
  template = [ '?>' ].concat(template).map(function (line, i) {
    i = i % 4
    if (i === 0) { // close tag ?>
      if (async) {
        async = false
        terminators.push('; };')
        return '; done = function() { write(`'
      } else if (vars) {
        vars = false
        return '); write(`'
      } else {
        return '; write(`'
      }
    } else if (i === 2) { // an open tag
      if (line === '<?js') {
        return '`);'
      } else if (line === '<?=') {
        vars = true
        return '`); write('
      } else if (line === '<?jsa') {
        async = true
        return '`); var done = function() { };'
      }
    } else if (i === 1) { // text block
      return line.replace(/`/g, '\\`')
    } else if (i === 3) { // code block
      return line
    }
  }).join('') + '`); __cb()' + terminators.join('')
  template = `(function() { return function(__cb) { ${template} }; })()`

  // console.log(template);
  // console.log('---')
  // template = eval(template) // eslint-disable-line
  return template
}

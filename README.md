# jsj

It's like PHP, only you write JavaScript!

**WARNING** This project is philthy with a "ph".

### Getting Started

```
$ npm install
$ npm start

$ curl "http://localhost:8080/index.jsj"
Hello world!
1234
Hello foobar!
Hello foobar!

Total: many entries.

The End.
```

The templating should look familiar:
```
Hello <?js write('world') ?>!
12<?js var a = 'foobar', b=0 ?>34
Hello <?js write(a) ?>!
Hello <?= a ?>!

Total: <?jsa // a for async, call done() when finished
setTimeout(function() {
  write("many");
  b++;
  done();
}, 100);
?> entries.

The End.
```

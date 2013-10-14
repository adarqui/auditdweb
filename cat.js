var
  Lazy = require('lazy'),
  Auditd = require('./auditd.js'),
  nconf = require('nconf'),
  fs = require('fs');


nconf.argv().env();

var conf = {
  in : null,
}

conf.in = nconf.get('in');

var usage = function() {
  console.log("node cat.js --in=file [--defer]");
  process.exit(-1);
}

if(!conf.in) {
  usage();
}


var auditd = new Auditd();
var stream;

var file = nconf.get('in');
if(file == '-') {
  stream = process.stdin;
}
else {
  stream = fs.createReadStream(conf.in)
}

stream.on('end', function(err) {
  var messages = auditd.messages();
  if(nconf.get('defer')) {
    console.log(JSON.stringify(messages,null,4));
  }
})

var cb = null;

var lazy = new Lazy(stream)
  .lines
  .forEach(function(line) {
    if(!line) return;
    var line = line.toString();
    if(!nconf.get('defer')) {
      cb = function(err,js) {
        console.log("processing:",err,JSON.stringify(js,null,4))
      }
    }
    auditd.process(line,cb);
  })

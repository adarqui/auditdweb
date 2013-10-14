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
  console.log("node cat.js --in=file");
  process.exit(-1);
}

if(!conf.in) {
  usage();
}


var auditd = new Auditd();
var stream = fs.createReadStream(conf.in)

stream.on('end', function(err) {
  var messages = auditd.messages();
  console.log(JSON.stringify(messages,null,4));
})

var lazy = new Lazy(stream)
  .lines
  .forEach(function(line) {
    var line = line.toString();
    auditd.process(line, function(err,js) {
    });
  })

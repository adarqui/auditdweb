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


var lazy = new Lazy(fs.createReadStream(conf.in))
  .lines
  .forEach(function(line) {
    var line = line.toString();
//    console.log(line)
    auditd.process(line, function(err,js) {
      console.log("err",err,"js",js);
    });
  })

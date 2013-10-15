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
    if(nconf.get('debug')) {
      console.log(JSON.stringify(messages,null,4));
    }
  }
})

var cb = null;

var print_stuff = function(js) {

  var output = []
  var type = nconf.get('type');
  if(type) {
    if(js.event.type != type) return;
  }

  if(nconf.get('syslog')) {
    var syslog = js.msg.host + " " + js.msg.daemon;
    output.push(syslog);
  }

  if(nconf.get('raw')) {
    output.push(js);
  }

  if(nconf.get('argv')) {
    var argv = [];
    for(var v in js.event) {
      if(v[0] == 'a') {
        var sanitized = js.event[v].replace(/^"/g,'').replace(/"$/g,'');
        argv.push(sanitized);
      }
    }
    var command_line = argv.join(' ')
    output.push(command_line);
  }

  console.log(output.join(' '));
}

var lazy = new Lazy(stream)
  .lines
  .forEach(function(line) {
    if(!line) return;
    var line = line.toString();
    if(!nconf.get('defer')) {
      cb = function(err,js) {
        if(nconf.get('debug')) {
          console.log("processing:",err,JSON.stringify(js,null,4))
        }
        print_stuff(js)
      }
    }
    auditd.process(line,cb);
  })

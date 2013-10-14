var
  _ = require('underscore');


var _Auditd = function() {
  var Auditd = this;

  Auditd.$ = {}
  var $ = Auditd.$
  $.messages = {}

  Auditd.process = function(line, cb) {
    console.log("line:",line);
    var tokens = line.split(' ')

    var audit = tokens[7];
    var re = /msg=audit\((.*):(.*)\)/
    var re_result = re.exec(audit);

    var id = re_result[2];

    if(!$.messages[id]) {
      var msg = {
        id : id,
        host : tokens[3],
        daemon : tokens[4],
        node : tokens[5],
        queue : {},
      }
      $.messages[id] = msg;
    }

    var entry = $.messages[id];

    for(var v in tokens) {
      var token = tokens[v];
      var kv = token.split('=',2);
      console.log(kv);
    }

    //console.log(msg);
    console.log(re_result);


  }

  Auditd.init = function() {
  }

  Auditd.init()
}

module.exports = _Auditd;

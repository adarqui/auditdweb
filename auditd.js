var
  _ = require('underscore');


var _Auditd = function() {
  var Auditd = this;

  Auditd.$ = {}
  var $ = Auditd.$
  $.messages = {}

  Auditd.process = function(line, cb) {
    var tokens, audit, re, re_result, entry, queue_item;
    tokens = line.split(' ')
    audit = tokens[7];

    if(tokens.length < 7) return;

    re = /msg=audit\((.*):(.*)\)/
    re_result = re.exec(audit);

    if(re_result == null) return;

    id = re_result[2];

    if(!$.messages[id]) {
      var msg = {
        id : id,
        host : tokens[3],
        daemon : tokens[4],
        node : tokens[5],
        queue : [],
      }
      $.messages[id] = msg;
    }

    entry = $.messages[id];

    tokens.splice(0,5);

    queue_item = {};
    _.each(tokens, function(token,index,list) {
      var key = token.indexOf('=');
      var rest = token.substring(key+1,token.length);
      key = token.substring(0,key);
      if(key.length == 0) return;
      queue_item[key] = rest;
    })

    entry.queue.push(queue_item);

    if(cb) {
      cb(null, queue_item);
    }
  }

  Auditd.messages = function() {
    return $.messages;
  }

  Auditd.init = function() {
  }

  Auditd.init()
}

module.exports = _Auditd;

var
  _ = require('underscore');


var _Auditd = function() {
  var Auditd = this;

  Auditd.$ = {}
  var $ = Auditd.$
  $.messages = {}

  Auditd.process = function(line, cb) {
    var tokens, audit, re, re_result, entry, queue_item, offset;
    tokens = line.split(' ')

    /* Location of type= */
    if(tokens[0].indexOf('type=') == 0) {
      offset = 0
    }
    else {
      offset = 6
    }

    audit = tokens[offset+1];

//    if(tokens.length < 7) return;

    re = /msg=audit\((.*):(.*)\)/
    re_result = re.exec(audit);
    if(re_result == null) return;
    id = re_result[2];

    if(!$.messages[id]) {
      var msg = {
        id : id,
        queue : [],
      }

      if(offset > 0) {
        msg.host = tokens[3]
        msg.daemon = tokens[4]
        msg.node = tokens[5]
      }

      $.messages[id] = msg;
    }

    entry = $.messages[id];

    if(offset > 0) {
      tokens.splice(0,5);
    }

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

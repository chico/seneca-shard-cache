/* Copyright (c) 2014 Chico Charlesworth, MIT License */
'use strict';

var sharder = require('sharder');

var name = 'seneca-shard-cache';

module.exports = function( options ) {

  var seneca = this;

  var shards = sharder(options);

  var role = 'cache';

  seneca.add({role: role, cmd: 'set'}, act);
  seneca.add({role: role, cmd: 'get'}, act);
  seneca.add({role: role, cmd: 'add'}, act);
  seneca.add({role: role, cmd: 'delete'}, act);
  seneca.add({role: role, cmd: 'incr'}, act);
  seneca.add({role: role, cmd: 'decr'}, act);

  function act(args, done) {
    var toact = Object.create(args)

    // Convert args.key to buffer
    var b = '' + args.key;
    var buf = new Buffer(b.length);
    for (var i = 0; i < b.length ; i++) {
      buf[i] = b.charCodeAt(i);
    }
    toact.shard = shards.resolve(shards.generate(buf)).id;

    seneca.log.info('Shard: ' + toact.shard);

    seneca.act(toact, function(err, result) {
      if (err) {return done(err);}
      done(null, result);
    });
  }

  return {
    name:name
  };
}

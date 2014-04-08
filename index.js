/* Copyright (c) 2014 Chico Charlesworth, MIT License */
'use strict';

var sharder = require('sharder');
var async = require('async');

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

    toact.shard = shards.resolve(args.key);

    seneca.act(toact, function(err, result) {
      if (err) {return done(err);}
      done(null, result);
    });
  }

  return {
    name:name
  };
}



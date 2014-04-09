/* Copyright (c) 2014 Chico Charlesworth, MIT License */
'use strict';

// var sharder = require('sharder');
var fash = require('fash');
var async = require('async');

var name = 'seneca-shard-cache';

module.exports = function( options ) {

  var seneca = this;

  // var shards = sharder(options);

  var pnodes = Object.keys(options.shards).map(function(shardId) {
      return '' + parseInt(shardId);
  });
  console.log(pnodes);

  var chash = fash.create({
      algorithm: 'sha-256', // Can be any algorithm supported by openssl.
      pnodes: pnodes, // The set of physical nodes to insert into the ring.
      vnodes: 1000000, // The virtual nodes to place onto the ring. Once set, this can't be changed for the lifetime of the ring.
      backend: fash.BACKEND.IN_MEMORY
  }, function(err, chash) {
      seneca.log.info('chash created');
  });

  var role = 'cache';

  seneca.add({role: role, cmd: 'set'}, act);
  seneca.add({role: role, cmd: 'get'}, act);
  seneca.add({role: role, cmd: 'add'}, act);
  seneca.add({role: role, cmd: 'delete'}, act);
  seneca.add({role: role, cmd: 'incr'}, act);
  seneca.add({role: role, cmd: 'decr'}, act);

  function act(args, done) {
    var toact = Object.create(args)

    // TODO use sharder once it can generate a shard key from an existing key
    // toact.shard = shards.resolve('' + args.key);
    toact.shard = chash.getNode('' + args.key);
    console.log('shard: ' + toact.shard);

    seneca.act(toact, function(err, result) {
      if (err) {return done(err);}
      done(null, result);
    });
  }

  return {
    name:name
  };
}



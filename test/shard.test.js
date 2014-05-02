/* Copyright (c) 2014 Chico Charlesworth, MIT License */
'use strict';

var uuid = require('uuid')
var sharder = require('sharder')
var assert = require('assert')

describe('shard-cache', function() {

  it('sharder', function( done ){
    var shards = sharder({cache:true, shards: { 1: {}, 2: {} }});
    var key = shards.generate(new Buffer([1, 2]));
    assert.equal(1, shards.resolve(key).id);
    done();
  });

  // TODO Add test for testing cache set and get

});



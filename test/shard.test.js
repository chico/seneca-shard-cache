/* Copyright (c) 2014 Chico Charlesworth, MIT License */
'use strict';

var uuid = require('uuid')
var sharder = require('sharder')
var assert = require('assert')

describe('shard-cache', function() {

  it('sharder', function( done ){
    var shards = sharder({shards: { 42: { append: true } }});
    var key = shards.generate();
    console.log(shards.resolve(key));
    done();
  });

});



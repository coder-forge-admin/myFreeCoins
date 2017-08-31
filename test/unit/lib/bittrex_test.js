var assert = require('assert'),
  Bittrex = require('../../../lib/bittrex'),
  config = require('../../../config'),
  should = require('should');

var bittrex = new Bittrex(config),
  wallets = [];

describe.skip('bittrex consumer unit', function(){

  it('will build up total costs of orders', function(done){

    var orders = require('./fixtures/bittrex.getTotalCost.orders.json'),
      deposits = require('./fixtures/bittrex.getTotalCost.deposits.json'),
      sells = require('./fixtures/bittrex.getTotalCost.sells.json'),
      withdrawls = require('./fixtures/bittrex.getTotalCost.withdrawls.json');

    bittrex.getTotalCost(orders, deposits, sells, withdrawls)
      .then(function(totalBtc){
        totalBtc.should.be.Number;
        done();
      })
      .catch(done);
  });

});

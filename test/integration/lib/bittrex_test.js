
var assert = require('assert'),
  Bittrex = require('../../../lib/bittrex'),
  config = require('../../../config'),
  should = require('should');

var bittrex = new Bittrex(config);

describe.only('bittrex consumer integration', function(){

  it('will test connection', function(done){

    bittrex.testConnection()
    .then(function(res){
      assert.equal(res.success, true);
      res.result.should.be.Array;
      done();
    })
    .catch(done);
  });

  it('will get wallets with balance', function(){

    return bittrex.getWallets()
      .then(function(_wallets){
        _wallets.should.be.Array;
        _wallets[0].should.have.property('Currency');
        _wallets[0].should.have.property('Balance');
        _wallets[0].should.have.property('Available');
        _wallets[0].should.have.property('Pending');
        _wallets[0].should.have.property('CryptoAddress');
      });
  });

  it('will get a wallets order history', function(done){

    var wallet =  {
        Currency: 'GAME',
        Balance: 4,
        Available: 4,
        Pending: 0,
        CryptoAddress: 'RyrB3yMDw8sszBH7rE4mmjjTitKnBK7fSP',
      };

    bittrex.getHistoryOrders(wallet)
      .then(function(res){
        res.should.be.Array;
        res[0].should.have.property('id');
        res[0].should.have.property('type');
        res[0].should.have.property('exchange');
        res[0].should.have.property('cost');
        done();
      })
      .catch(done);
  });

  /**
   * @deprecated Might be a future feature.
   */
  it.skip('will get a wallets deposit history', function(done){

    var wallet =  {
        Currency: 'NEO',
        Balance: 4,
        Available: 4,
        Pending: 0,
        CryptoAddress: 'RyrB3yMDw8sszBH7rE4mmjjTitKnBK7fSP',
      };

    bittrex.getHistoryDeposits(wallet)
      .then(function(res){
        res.should.be.Array;
        res[0].should.have.property('id');
        res[0].should.have.property('exchange');
        res[0].should.have.property('cost');
      });
  });

  it.only('will get a wallets totals', function(done){

    var wallet =  {
        Currency: 'GAME',
        Balance: 4,
        Available: 4,
        Pending: 0,
        CryptoAddress: 'RyrB3yMDw8sszBH7rE4mmjjTitKnBK7fSP',
      },
      orders = [ { id: 'aa26635d-588e-4eff-861c-ed685a634f30',
    type: 'LIMIT_SELL',
    exchange: 'BTC-GAME',
    cost: 0.06251559 },
  { id: 'a308c884-3ef9-4c00-b4b8-2d21093169da',
    type: 'LIMIT_BUY',
    exchange: 'BTC-GAME',
    cost: 0.00707937 },
  { id: '44b20c84-bc5e-4f20-9efa-5c10a5df5a81',
    type: 'LIMIT_BUY',
    exchange: 'BTC-GAME',
    cost: 0.055125 } ];

    bittrex.getTotals(wallet, orders)
      .then(function(res){
        console.log(res);
        done();
      });
  });
});

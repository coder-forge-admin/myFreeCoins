
var API = require('node.bittrex.api'),
  async = require('async'),
  promises = require('bluebird');

var bittrex = function BittrexConsumer(config){

  var self = this;
  self.config = config;

  API.options({
    'apikey': self.config.api,
    'apisecret': self.config.secret,
    'inverse_callback_arguments': true,
  });

  /**
   * Get wallet history.
   * @param  {Object} wallet A wallet returned from self::getWallets.
   * @return {Promise}        Resolves to [{id, cost, exchange}]
   */
  this.getHistoryOrders = function getHistoryOrders(wallet){
    return new promises.Promise(function(resolve, reject){

      var exchange = 'BTC-'+wallet.Currency;

      // get orders
      API.getorderhistory({market: exchange}, function(err, res){
        if(err) return reject(err);

        var orders = res.result.map(function(order){

          return {
            id: order.OrderUuid,
            type: order.OrderType,
            exchange: order.Exchange,
            cost: order.Price,
          }
        });

        resolve(orders);
      });
    });
  }

  /**
   * Get deposit history.
   * @deprecated Not in use, might be future feature.
   * @param  {Object} wallet A wallet returned from self::getWallets.
   * @return {Promise}        Resolves to [{id, cost, exchange}]
   */
  this.getHistoryDeposits = function getHistoryDeposits(wallet){
    return new promises.Promise(function(resolve, reject){

      // get deposits
      API.getdeposithistory({}, function(err, res){

        var deposits = res.result.filter(function(deposit){
          /*{ Id: 23340084,
            Amount: 0.00130925,
            Currency: 'BTC',
            Confirmations: 2,
            LastUpdated: '2017-07-19T06:14:09.87',
            TxId: '5a9aae14d8796f2387189428f10f775f447903e8fa56cd8b38acf4143da355d0',
            CryptoAddress: '184PFHhoKN4CUr8i6ajpjAcUZxcYoaGzyn' }*/

          self.getBidAtDate(function(bid){
            // https://bittrex.com/Api/v2.0/pub/market/GetTicks?marketName=BTC-WAVES&tickInterval=thirtyMin&_=1499127220008
          })
          return {
            id: deposit.Id,
            ticket: deposit.Currency,
            cost: deposit.Amount,
          }
        });

        return resolve(deposits);
      });
    });

  }

  /**
   * Get wallets with a balance.
   * @uses API::getbalances()
   * @return {Promise} resolves to {succes, message, wallets}
   */
  this.getWallets = function getWallets(){
    return new promises.Promise(function(resolve, reject){

      API.getbalances(function(err, res){
        if(err) return reject(err);

        var wallets = res.result.filter(function(wallet){
          if(wallet.Balance>0){

            return wallet;
          }
        });

        resolve(wallets);
      });
    });
  }

  /**
   * tests connection to bittrex.com
   * @uses API::getmarketsummaries()
   * @return {Promise} resolves to {succes, message, result}
   */
  this.testConnection = function testConnection(){
    return new promises.Promise(function(resolve, reject){

      API.getmarketsummaries(function(err, data){
        if(err) return reject(err);
        return resolve(data);
      });
    });

  }

  this.getTotals = function getTotalCost(wallet, orders){
    return new promises.Promise(function(resolve, reject){

      var buy = parseFloat(0.00); var sell = parseFloat(0.00);

      for(var x=0; x<orders.length; x++){
        if(orders[x].type=='LIMIT_SELL')
          sell = parseFloat(sell) + parseFloat(orders[x].cost);
        else{
          buy = parseFloat(buy) + parseFloat(orders[x].cost);
        }
      }

      resolve({
        balance: (parseFloat(sell) - parseFloat(buy)).toFixed(8),
        sell: sell,
        buy: buy,
      });
    });
  }

  return self;
}

module.exports = bittrex;

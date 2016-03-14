var mongoose = require('mongoose');

var MerchantSchema = mongoose.Schema({
    dragonFruit: Number
  , kiwi: Number
  , olive: Number
  , strawberry: Number
  , plum: Number
  , vp: Number
  , image: String
});

module.exports = mongoose.model('Merchant', MerchantSchema);

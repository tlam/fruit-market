var mongoose = require('mongoose');

var CardSchema = mongoose.Schema({
    level: Number
  , dragonFruitCost: Number
  , kiwiCost: Number
  , oliveCost: Number
  , strawberryCost: Number
  , plumCost: Number
  , dragonFruit: Number
  , kiwi: Number
  , olive: Number
  , strawberry: Number
  , plum: Number
  , vp: Number
  , fruit: String
});

module.exports = mongoose.model('Card', CardSchema);

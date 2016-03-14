var mongoose = require('mongoose')
  , Card = require('./card.js')
  , Merchant = require('./merchant.js')
  , Player = require('./player.js');

var BoardSchema = mongoose.Schema({
    merchants: [Merchant.schema]
  , deckOne: [Card.schema]
  , deckTwo: [Card.schema]
  , deckThree: [Card.schema]
  , lineOne: [Card.schema]
  , lineTwo: [Card.schema]
  , lineThree: [Card.schema]
  , dragonFruit: {type: Number, default: 0}
  , kiwi: {type: Number, default: 0}
  , olive: {type: Number, default: 0}
  , strawberry: {type: Number, default: 0}
  , plum: {type: Number, default: 0}
  , pineapple: {type: Number, default: 0}
  , players: [Player.schema]
});

BoardSchema.methods.assignNextPlayer = function(player, next) {
  var board = this;
  var nextPlayerNumber = player.number + 1;
  if (nextPlayerNumber > board.players.length) {
    nextPlayerNumber = 1;
  }

  var sortedPlayers = [];
  board.players.forEach(function(p) {
    if (p.number === player.number) {
      sortedPlayers.push(player);
    }
    else {
      sortedPlayers.push(p);
    }
  });
  sortedPlayers.forEach(function(p) {
    board.players.id(p._id).remove();
  });

  sortedPlayers.sort(function(a, b) {
    return a.number > b.number;
  });

  var gameOverMsg = '';
  sortedPlayers.forEach(function(p) {
    var merchantsRemoved = [];
    board.merchants.forEach(function(merchant) {
      if (merchant.dragonFruit <= p.dragonFruit &&
          merchant.kiwi <= p.kiwiDevelopment &&
          merchant.olive <= p.oliveDevelopment &&
          merchant.strawberry <= p.strawberryDevelopment &&
          merchant.plum <= p.plumDevelopment) {
        p.vp += merchant.vp;
        merchantsRemoved.push(merchant);
        p.merchants.push(merchant);
      }
    });

    merchantsRemoved.forEach(function(merchant) {
      board.merchants.id(merchant._id).remove();
    });

    console.log('VP for ' + p.number + ' ' + p.vp);
    if (p.vp >= 15) {
      gameOverMsg = 'Player ' + p.number + ' won';
    }
    if (p.number === nextPlayerNumber) {
      p.isTurn = true;
    }
    else {
      p.isTurn = false;
    }
    p.save();
    board.players.push(p);
  });
  //board.save();

  if (gameOverMsg === '') {
    next();
  }
  else {
    var err = new Error(gameOverMsg);
    next(err);
  }
};

module.exports = mongoose.model('Board', BoardSchema);

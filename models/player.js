var mongoose = require('mongoose')
  , Card = require('./card.js')
  , Merchant = require('./merchant.js');

var PlayerSchema = mongoose.Schema({
    number: Number
  , vp: {type: Number, default: 0}
  , dragonFruit: {type: Number, default: 0}
  , dragonFruitDevelopment: {type: Number, default: 0}
  , dragonFruitToken: {type: Number, default: 0}
  , kiwi: {type: Number, default: 0}
  , kiwiDevelopment: {type: Number, default: 0}
  , kiwiToken: {type: Number, default: 0}
  , olive: {type: Number, default: 0}
  , oliveDevelopment: {type: Number, default: 0}
  , oliveToken: {type: Number, default: 0}
  , strawberry: {type: Number, default: 0}
  , strawberryDevelopment: {type: Number, default: 0}
  , strawberryToken: {type: Number, default: 0}
  , plum: {type: Number, default: 0}
  , plumDevelopment: {type: Number, default: 0}
  , plumToken: {type: Number, default: 0}
  , pineapple: {type: Number, default: 0}
  , isTurn: {type: Boolean, default: false}
  , reserved: [Card.schema]
  , purchased: [Card.schema]
  , dragonFruitCards: [Card.schema]
  , kiwiCards: [Card.schema]
  , oliveCards: [Card.schema]
  , strawberryCards: [Card.schema]
  , plumCards: [Card.schema]
  , merchants: [Merchant.schema]
  , status: String
});

PlayerSchema.methods.totalFruits = function() {
  return this.dragonFruitToken + this.kiwiToken + this.oliveToken + this.strawberryToken + this.plumToken;
};

PlayerSchema.methods.buy = function(card, board, paid, next) {
  var player = this;

  var fruits = ['dragonFruit', 'kiwi', 'olive', 'strawberry', 'plum'];
  fruits.forEach(function(fruit) {
    if (fruit === 'dragonFruit') {
      player.dragonFruitToken -= paid[fruit];
      board.dragonFruit += paid[fruit];
    }
    else if (fruit === 'kiwi') {
      player.kiwiToken -= paid[fruit];
      board.kiwi += paid[fruit];
    }
    else if (fruit === 'olive') {
      player.oliveToken -= paid[fruit];
      board.olive += paid[fruit];
    }
    else if (fruit === 'strawberry') {
      player.strawberryToken -= paid[fruit];
      board.strawberry += paid[fruit];
    }
    else if (fruit === 'plum') {
      player.plumToken -= paid[fruit];
      board.plum += paid[fruit];
    }
  });
  player.pineapple -= paid.pineapple;
  board.pineapple += paid.pineapple;

  if (card.dragonFruit > 0) {
    player.dragonFruitCards.push(card);
  }
  else if (card.kiwi > 0) {
    player.kiwiCards.push(card);
  }
  else if (card.olive > 0) {
    player.oliveCards.push(card);
  }
  else if (card.strawberry > 0) {
    player.strawberryCards.push(card);
  }
  else if (card.plum > 0) {
    player.plumCards.push(card);
  }

  player.dragonFruit += card.dragonFruit;
  player.kiwi += card.kiwi;
  player.olive += card.olive;
  player.strawberry += card.strawberry;
  player.plum += card.plum;
  player.dragonFruitDevelopment += card.dragonFruit;
  player.kiwiDevelopment += card.kiwi;
  player.oliveDevelopment += card.olive;
  player.strawberryDevelopment += card.strawberry;
  player.plumDevelopment += card.plum;
  player.purchased.push(card);
  player.vp += card.vp;
  player.isTurn = false;
  player.save();
  board.save();
  next();
};

PlayerSchema.methods.reserve = function(card, board, next) {
  var player = this;
  if (player.reserved.length === 3) {
    var err = new Error('You already have 3 cards reserved');
    next(err);
  }
  else {
    player.pineapple += 1;
    player.reserved.push(card);
    player.isTurn = false;
    board.pineapple -= 1;
    if (card.level === 1) {
      board.lineOne.id(card._id).remove();
      var poppedOne = board.deckOne.$pop();
      board.lineOne.push(poppedOne);
    }
    else if (card.level === 2) {
      board.lineTwo.id(card._id).remove();
      var poppedTwo = board.deckTwo.$pop();
      board.lineTwo.push(poppedTwo);
    }
    else {
      board.lineThree.id(card._id).remove();
      var poppedThree = board.deckThree.$pop();
      board.lineThree.push(poppedThree);
    }
    board.save();
    player.save();
    board.save();
    next();
  }
};

module.exports = mongoose.model('Player', PlayerSchema);

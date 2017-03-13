var express = require('express')
  , fs = require('fs')
  , Card = require('../models/card.js')
  , Merchant = require('../models/merchant.js');
var router = express.Router();

router.get('/load_cards', function(req, res, next) {
  var output = fs.readFileSync('models/fixtures/merchants.json');
  var merchants = JSON.parse(output);
  Merchant.remove().exec();
  for (var i=0; i<merchants.length; i++) {
    var merchant = merchants[i];
    var newMerchant = new Merchant({
      dragonFruit: merchant['dragon_fruit'],
      kiwi: merchant['kiwi'],
      image: merchant['image'],
      olive: merchant['olive'],
      strawberry: merchant['strawberry'],
      plum: merchant['plum'],
      vp: merchant['vp']
    });
    newMerchant.save()
  }

  output = fs.readFileSync('models/fixtures/cards.json');
  var cards = JSON.parse(output);
  Card.remove().exec();
  for (var i=0; i<cards.length; i++) {
    var card = cards[i];
    var newCard = new Card({
      level: card['level'],
      dragonFruitCost: card['dragon_fruit_cost'],
      kiwiCost: card['kiwi_cost'],
      oliveCost: card['olive_cost'],
      strawberryCost: card['strawberry_cost'],
      plumCost: card['plum_cost'],
      dragonFruit: card['dragon_fruit'],
      kiwi: card['kiwi'],
      olive: card['olive'],
      strawberry: card['strawberry'],
      plum: card['plum'],
      vp: card['vp']
    });
    newCard.save();
  }

  res.json({message: 'Loaded!'});
});

module.exports = router;

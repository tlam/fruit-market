var sio = require('socket.io')
  , utils = require('./lib/utils.js')
  , Board = require('./models/board.js')
  , Card = require('./models/card.js')
  , Merchant = require('./models/merchant.js')
  , Player = require('./models/player.js');

module.exports.listen = function(app) {
  io = sio.listen(app);

  io.sockets.on('connection', function(socket) {
    socket.on('start game', function(data) {
      Merchant.find({}, function(err, merchants) {
        Board.remove().exec();
        // TODO: abstract board creation in Model method
        var board = new Board();
        var numPlayers = data.numPlayers;
        var initialData = {
          2: {fruits: 4, merchants: 3},
          3: {fruits: 5, merchants: 4}};
        utils.shuffle(merchants);
        for (var i = 0; i < initialData[numPlayers].merchants; i++) {
          board.merchants.push(merchants[i]);
        }
        var numFruits = initialData[numPlayers].fruits;
        board.dragonFruit = numFruits;
        board.kiwi = numFruits;
        board.olive = numFruits;
        board.strawberry = numFruits;
        board.plum = numFruits;
        board.pineapple = 5;
        board.save();
        Card.find({}, function(err, cards) {
          utils.shuffle(cards);

          var numOne = 0;
          var numTwo = 0;
          var numThree = 0;
          cards.forEach(function(card) {
            if (card.level === 1) {
              if (numOne < 4) {
                board.lineOne.push(card);
              } else {
                board.deckOne.push(card);
              }
              numOne++;
            }
            else if (card.level === 2) {
              if (numTwo < 4) {
                board.lineTwo.push(card);
              } else {
                board.deckTwo.push(card);
              }
              numTwo++;
            }
            else {
              if (numThree < 4) {
                board.lineThree.push(card);
              } else {
                board.deckThree.push(card);
              }
              numThree++;
            }
          });
          Player.remove().exec();
          for (var j = 0; j < numPlayers; j++) {
            var player = new Player({
              number: j + 1
            });
            if (j === 0) {
              player.isTurn = true;
            }
            player.save();
            board.players.push(player);
          }

          board.save();
          io.sockets.emit('display cards', {
            board: board,
            msg: ''
          });
        });
      });
    });
    socket.on('end turn', function(data) {
      var msg = '';
      var total = data.dragonFruit + data.kiwi + data.olive + data.strawberry + data.plum;
      var isSameColour = data.dragonFruit >= 2
        || data.kiwi >= 2
        || data.olive >= 2
        || data.strawberry >= 2
        || data.plum >= 2;

      if (total > 3) {
        msg = 'You can take at most 3 fruits';
      }
      else if (total === 3 && isSameColour) {
        msg = 'You can only take 3 fruits of different colours';
      }
      else if (total === 2 && !isSameColour) {
        msg = 'You can only take 2 fruits of same colour';
      }

      if (msg.length > 0) {
        io.sockets.emit('status', {
          msg: msg
        });
      }
      else {
        Player.findOne({'_id': data.player}, function(err, player) {
          player.dragonFruit += data.dragonFruit;
          player.dragonFruitToken += data.dragonFruit;
          player.kiwi += data.kiwi;
          player.kiwiToken += data.kiwi;
          player.olive += data.olive;
          player.oliveToken += data.olive;
          player.strawberry += data.strawberry;
          player.strawberryToken += data.strawberry;
          player.plum += data.plum;
          player.plumToken += data.plum;
          player.save();
          if (player.totalFruits() > 10) {
            msg = 'Please return some of the fruits since you have more than 10';
            io.sockets.emit('status', {
              msg: msg
            });
          }
          else {
            Board.findOne({}, function(err, board) {
              board.dragonFruit -= data.dragonFruit;
              board.kiwi -= data.kiwi;
              board.olive -= data.olive;
              board.strawberry -= data.strawberry;
              board.plum -= data.plum;
              board.save();
              board.assignNextPlayer(player, function(errors) {
                var message = 'Fruits taken';
                if (errors) {
                  message = errors.message;
                }
                io.sockets.emit('display cards', {
                  board: board,
                  msg: message
                });
              });
            });
          }
        });
      }
    });

    socket.on('resume', function() {
      Board.findOne({}, function(err, board) {
        io.sockets.emit('display cards', {
          board: board,
          msg: 'resuming'
        });
      });
    });

    socket.on('buy', function(data) {
      Player.findOne({'_id': data.player}, function(err, player) {
        Card.findOne({'_id': data.card}, function(err, card) {
          Board.findOne({}, function(err, board) {
            player.buy(card, board, data.paid, function(errors) {
              if (errors) {
                io.sockets.emit('display cards', {
                  board: board,
                  msg: errors.message
                });
              }
              else {
                var isReservedCard = false;
                for (var i = 0; i < player.reserved.length; i++) {
                  var reservedCard = player.reserved[i];
                  if (reservedCard._id.toString() === card._id.toString()) {
                    var poppedReserved = player.reserved.id(card._id).remove();
                    player.purchased.push(poppedReserved);
                    player.save();
                    isReservedCard = true;
                    break;
                  }
                }

                if (!isReservedCard) {
                  if (card.level === 1) {
                    board.lineOne.id(card._id).remove();
                    if (board.deckOne.length > 0) {
                      var poppedOne = board.deckOne.$pop();
                      board.lineOne.push(poppedOne);
                    }
                  }
                  else if (card.level === 2) {
                    board.lineTwo.id(card._id).remove();
                    if (board.deckTwo.length > 0) {
                      var poppedTwo = board.deckTwo.$pop();
                      board.lineTwo.push(poppedTwo);
                    }
                  }
                  else {
                    board.lineThree.id(card._id).remove();
                    if (board.deckThree.length > 0) {
                      var poppedThree = board.deckThree.$pop();
                      board.lineThree.push(poppedThree);
                    }
                  }
                  board.save();
                }
                board.assignNextPlayer(player, function(errors) {
                  var message = 'Card bought';
                  if (errors) {
                    message = errors.message;
                  }
                  io.sockets.emit('display cards', {
                    board: board,
                    msg: message
                  });
                });
              }
            });
          });
        });
      });
    });

    socket.on('reserve', function(data) {
      Player.findOne({'_id': data.player}, function(err, player) {
        Card.findOne({'_id': data.card}, function(err, card) {
          Board.findOne({}, function(err, board) {
            player.reserve(card, board, function(errors) {
              if (errors) {
                io.sockets.emit('display cards', {
                  board: board,
                  msg: errors.message
                });
              }
              else {
                board.assignNextPlayer(player, function(errors) {
                  var message = 'Card reserved';
                  if (errors) {
                    message = errors.message;
                  }
                  io.sockets.emit('display cards', {
                    board: board,
                    msg: message
                  });
                });
              }
            });
          });
        });
      });
    });

  });
  return io;
};

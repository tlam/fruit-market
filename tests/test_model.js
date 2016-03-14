var Board = require('../models/board.js')
  , Player = require('../models/player.js')
  , mongoose = require('mongoose');

var mongoUri = 'mongodb://localhost/fruitmarket';
var mongoOptions = {db: {safe: true}};
mongoose.connect(mongoUri, mongoOptions);

var assert = require("assert")

describe('Board', function(){
  describe('#create', function(){
    it('should return board', function(done){
      Board.remove().exec();
      var board = new Board();
      board.save();
      assert.equal(board.players.length, 0);

      Player.remove().exec();
      var numPlayers = 2;
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
      assert.equal(board.players.length, 2);

      board.players.forEach(function(player) {
        if (player.number === 1) {
          assert.equal(player.isTurn, true);
        }
        else {
          assert.equal(player.isTurn, false);
        }
      });
      board.assignNextPlayer(board.players[0], function(errors) {
        board.players.forEach(function(player) {
          if (player.number === 2) {
            assert.equal(player.isTurn, true);
          }
          else {
            assert.equal(player.isTurn, false);
          }
        });
        done();
      });
    })
  })
})

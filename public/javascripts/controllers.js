angular.module('FruitMarket').controller('FruitMarketCtrl', function FruitMarketCtrl($scope, socket) {
  $scope.board = {
    players: [],
    merchants: []
  };
  $scope.currentPlayer = null;
  $scope.players = [2, 3];
  $scope.numPlayers = 0;
  $scope.paid = {
    dragonFruit: 0,
    kiwi: 0,
    olive: 0,
    strawberry: 0,
    plum: 0
  };
  $scope.playerDevelopment = {
    dragonFruit: 0,
    kiwi: 0,
    olive: 0,
    strawberry: 0,
    plum: 0
  };
  $scope.tokenSpent = {
    dragonFruit: 0,
    kiwi: 0,
    olive: 0,
    strawberry: 0,
    plum: 0,
    pineapple: 0
  };
  $scope.taken = {
    dragonFruit: 0,
    kiwi: 0,
    olive: 0,
    strawberry: 0,
    plum: 0
  };
  $scope.selectedCard = null;
  $scope.show = false;
  $scope.cost = {};
  $scope.fruits = ['dragonFruit', 'kiwi', 'olive', 'strawberry', 'plum'];

  $scope.start = function() {
    console.log('starting');
    socket.emit('start game', {
      numPlayers: $scope.numPlayers
    });
  };

  $scope.takeFruit = function(fruit) {
    if ($scope.taken[fruit] < $scope.board[fruit]) {
      $scope.taken[fruit] += 1;
    }
  };

  $scope.endTurn = function() {
    console.log('Ending turn');
    $scope.board.players.forEach(function(player) {
      if (player.isTurn) {
        socket.emit('end turn', {
          player: player._id,
          dragonFruit: $scope.taken.dragonFruit,
          kiwi: $scope.taken.kiwi,
          olive: $scope.taken.olive,
          strawberry: $scope.taken.strawberry,
          plum: $scope.taken.plum,
          numPlayers: $scope.board.players.length
        });
      }
    });
  };

  $scope.resume = function() {
    socket.emit('resume', {});
  };

  $scope.reset = function() {
    $scope.fruits.forEach(function(fruit) {
      $scope.taken[fruit] = 0;
      $scope.tokenSpent[fruit] = 0;
      $scope.paid[fruit] = 0;
    });
    $scope.selectedCard = null;
    $scope.tokenSpent['pineapple'] = 0;
  };

  $scope.selectToken = function(token) {
    if ($scope.fruits.indexOf(token) > -1 && $scope.cost[token] > 0 && $scope.paid[token] < $scope.currentPlayer[token]) {
      $scope.paid[token] += 1;
      $scope.tokenSpent[token] += 1;
    }
    else if (token === 'pineapple' && $scope.tokenSpent[token] < $scope.currentPlayer.pineapple) {
      console.log('in pineapple');
      for (var fruit in $scope.cost) {
        console.log('looping ' + fruit);
        console.log($scope.paid[fruit] + $scope.playerDevelopment[fruit]);
        console.log($scope.currentPlayer[fruit]);
        if ($scope.cost[fruit] > 0 && $scope.paid[fruit] + $scope.playerDevelopment[fruit] < $scope.cost[fruit]) {
          console.log('selecting pineapple');
          $scope.paid[fruit] += 1;
          $scope.tokenSpent[token] += 1;
          break;
        }
      }
    }
  };

  $scope.buy = function() {
    $scope.show = true;
    if ($scope.currentPlayer.isTurn) {
      var dragonFruitCost = $scope.selectedCard.dragonFruitCost;
      var kiwiCost = $scope.selectedCard.kiwiCost;
      var oliveCost = $scope.selectedCard.oliveCost;
      var strawberryCost = $scope.selectedCard.strawberryCost;
      var plumCost = $scope.selectedCard.plumCost;

      var costMet = (dragonFruitCost === 0 || (dragonFruitCost > 0 && dragonFruitCost <= $scope.paid.dragonFruit + $scope.playerDevelopment.dragonFruit)) &&
        (kiwiCost === 0 || (kiwiCost > 0 && kiwiCost <= $scope.paid.kiwi + $scope.playerDevelopment.kiwi)) &&
        (oliveCost === 0 || (oliveCost > 0 && oliveCost <= $scope.paid.olive + $scope.playerDevelopment.olive)) &&
        (strawberryCost === 0 || (strawberryCost > 0 && strawberryCost <= $scope.paid.strawberry + $scope.playerDevelopment.strawberry)) &&
        (plumCost === 0 || (plumCost > 0 && plumCost <= $scope.paid.plum + $scope.playerDevelopment.plum));
      if (costMet) {
        console.log('Cost met');
        socket.emit('buy', {
          card: $scope.selectedCard._id,
          paid: $scope.tokenSpent,
          player: $scope.currentPlayer._id
        });
      }
      else {
        $scope.msg = 'Cost not met';
      }
    }
  };

  $scope.reserve = function() {
    if ($scope.selectedCard !== null) {
      socket.emit('reserve', {
        card: $scope.selectedCard._id,
        player: $scope.currentPlayer._id
      });
    }
  };

  $scope.cardClass = function(card, area) {
    if (area === 'development' && $scope.selectedCard && card) {
      return card._id === $scope.selectedCard._id ? 'card-selected' : undefined;
    }
  };

  $scope.selected = function(card, area) {
    if (area === 'development') {
      $scope.selectedCard = card;
      $scope.fruits.forEach(function(fruit) {
        var cost = '';
        if (fruit === 'dragonFruit') {
          cost = card.dragonFruitCost;
        }
        else if (fruit === 'kiwi') {
          cost = card.kiwiCost;
        }
        else if (fruit === 'olive') {
          cost = card.oliveCost;
        }
        else if (fruit === 'strawberry') {
          cost = card.strawberryCost;
        }
        else if (fruit === 'plum') {
          cost = card.plumCost;
        }
        $scope.cost[fruit] = cost;
      });
    }
  };

  socket.on('display cards', function(data) {
    $scope.reset();
    $scope.board = data.board;
    $scope.msg = data.msg;
    $('div.alert div').fadeOut('slow').fadeIn('slow');
    $scope.board.players.forEach(function(player) {
      if (player.isTurn) {
        $scope.currentPlayer = player;
        $scope.playerDevelopment.dragonFruit = player.dragonFruitDevelopment;
        $scope.playerDevelopment.kiwi = player.kiwiDevelopment;
        $scope.playerDevelopment.olive = player.oliveDevelopment;
        $scope.playerDevelopment.strawberry = player.strawberryDevelopment;
        $scope.playerDevelopment.plum = player.plumDevelopment;
      }
    });
  });

  socket.on('status', function(data) {
    $scope.msg = data.msg;
  });
});

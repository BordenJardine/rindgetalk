var express = require('express');
var router = express.Router();

var determineVictor = function(playerMove, serverMove) {
  if(playerMove == 'rock' && serverMove == 'rock') {
    return 'draw';
  }
  if(playerMove == 'rock' && serverMove == 'paper') {
    return 'server';
  }
  if(playerMove == 'rock' && serverMove == 'scissors') {
    return 'player';
  }
  if(playerMove == 'paper' && serverMove == 'rock') {
    return 'player';
  }
  if(playerMove == 'paper' && serverMove == 'paper') {
    return 'draw';
  }
  if(playerMove == 'paper' && serverMove == 'scissors') {
    return 'server';
  }
  if(playerMove == 'scissors' && serverMove == 'rock') {
    return 'server';
  }
  if(playerMove == 'scissors' && serverMove == 'paper') {
    return 'player';
  }
  if(playerMove == 'scissors' && serverMove == 'scissors') {
    return 'draw';
  }
};

var insertGame = function(db, gameInfo, done) {
  db.collection('games').insertOne(gameInfo, function(err, result) {
    if(err) console.log(err);
    if(done) done(result);
  });
};

var generateServerMove = function() {
  var num = Math.ceil(Math.random() * 3);
  switch (num) {
    case 1:
      return 'rock';
    case 2:
      return 'paper';
    case 3:
      return 'scissors';
  }
};

var getScore = function(games) {
  var score = {
    player: 0,
    server: 0,
    winner: 'nobody'
  };

  games.forEach(function(game) {
    if (game.winner == 'player') {
      score.player += 1;
    } else if (game.winner == 'server') {
      score.server += 1;
    }
  });

  if (score.player > 2) {
    score.winner = 'player';
  } else if (score.server > 2) {
    score.winner = 'server';
  }
  return score;
};

var getResults = function(games) {
  var mostRecentGame = games[0];
  var resultText = 'DRAW';
  var result = 'draw';
  if(mostRecentGame.winner == 'player') {
    resultText = 'You WON!'
    result = 'win';
  } else if (mostRecentGame.winner == 'server') {
    resultText = 'The Server W0N!'
    result = 'lose';
  }
  return {
    headerText: resultText,
    result: result,
    playerMove: mostRecentGame.player,
    serverMove: mostRecentGame.server,
  }
};

var getGames = function(db, done) {
  db.collection('games').find({}).sort({number: -1}).toArray((err, games) => {
    if(err) console.log(err);
    var score = getScore(games);
    done(games, score);
  });
};

/* GET home page. */
router.get('/', function(req, res) {
    res.redirect('/game');
});

router.get('/game', (req, res) => {
  getGames(req.db, function(games, score) {
    var mostRecentGame = games[0];
    res.render('game', {score: score});
  });
});

router.post('/game', (req, res) => {
  getGames(req.db, function(games) {
    var playerMove = req.body.move;
    var serverMove = generateServerMove();
    var gameInfo = {
      player: playerMove,
      server: serverMove,
      winner: determineVictor(playerMove, serverMove),
      number: games.length + 1
    };
    insertGame(req.db, gameInfo, function() {
      res.redirect('/results');
    });
  });
});

router.get('/results', (req, res) => {
  getGames(req.db, function(games, score) {
    results = getResults(games);
    results.score = score;
    res.render('results', results);
  });
});

module.exports = router;

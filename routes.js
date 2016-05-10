var express = require('express');
var router = express.Router();


var insertGame = function(game, done) {
  req.db.collection('games').find({}).sort({number: -1}).toArray((err, games) => {
    if(err) console.log(err);
    done(games);
  });
}

var renderResults = function(res) {

};

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
  getGames(function(games) {
    var playerMove = req.body.move;
    var serverMove = generateServerMove();
    var victor = determineVictor(playerMove, serverMove);
    var number = games.length;
    insertGame(playerMove, serverMove, victor, number);
    res.render('result', {winner: 'rock paper scissors'});
  });
});

router.get('/result', (req, res) => {
  req.db.collection('games').find({}).sort({number: -1}).toArray((err, games) => {
    res.render('home', {txt: 'rock paper scissors'});
  });
});

module.exports = router;

// import $ from 'jquery';

// For front-end applicants: write a JavaScript/CoffeeScript program according
// to the following specifications. When you run the program, the program should
// play the game automatically. When you're happy with your score, submit your
// score to us.


// The overall workflow is in 5 stages: 1) "Start Game", 2) "Give Me A Word",
// 3) "Make A Guess", 4) "Get Your Result" and 5) "Submit Your Result"
// You can play and submit as many times as you want,
// but we only store the LATEST submitted score. When you're satisfied with
// your score, don't submit any more!

// Request URL: https://strikingly-hangman.herokuapp.com/game/on
// Player ID: tonyhoyinliu@gmail.com

// {
//   "playerId": "test@example.com",
//   "action" : "startGame"
// }
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var xhr = new XMLHttpRequest();
var sessionId;

function startGame(player = "tonyhoyinliu@gmail.com", action = "startGame") {
  xhr.open("POST", "https://strikingly-hangman.herokuapp.com/game/on", false);
  xhr.send(JSON.stringify({playerId: player, action: action}));

  // console.log("hello");
  // console.log(xhr.responseText);
  // console.log(JSON.parse(xhr.responseText));
  sessionId = JSON.parse(xhr.responseText).sessionId;
}


startGame();

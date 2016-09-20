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


// step 1) start game
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var xhr = new XMLHttpRequest();
var sessionId;
var numberOfWordsToGuess;
var numberOfGuessesAllowedForEachWord;
var currentScore;
var words = require('an-array-of-english-words');

function startGame(player = "tonyhoyinliu@gmail.com", action = "startGame") {
  xhr.open("POST", "https://strikingly-hangman.herokuapp.com/game/on", false);
  xhr.send(JSON.stringify({playerId: player, action: action}));

  // console.log("hello");
  // console.log(xhr.responseText);
  // console.log(JSON.parse(xhr.responseText));
  sessionId = JSON.parse(xhr.responseText).sessionId;
  numberOfWordsToGuess = (JSON.parse(xhr.responseText).data.numberOfWordsToGuess);
  numberOfGuessesAllowedForEachWord = (JSON.parse(xhr.responseText).data.numberOfGuessesAllowedForEachWord);

  giveMeAWord();
}

// startGame();

function testing() {
  // var funWords = words.filter(function(w) { return !!w.match(/^fun/i); });
  var funWords = words.filter((word) => word.length <= 5);
  console.log(funWords);
}

testing();

// step 2) give me a word

// Word Difficulty:
// 1st to 20th word : length <= 5 letters
// 21st to 40th word : length <= 8 letters
// 41st to 60th word : length <= 12 letters
// 61st to 80th word : length > 12 letters

function giveMeAWord(action = "nextWord") {
  xhr.open("POST", "https://strikingly-hangman.herokuapp.com/game/on", false);
  xhr.send(JSON.stringify({sessionId: sessionId, action: action}));

  // console.log(JSON.parse(xhr.responseText));
  // console.log(JSON.parse(xhr.responseText).data.word);
  makeGuess(JSON.parse(xhr.responseText).data.word); // make a guess, pass down unguessed word
}

// step 3) make a guess
// ONE character per request, ONLY capital letters.

function makeGuess(word, idx = 0, action = "guessWord") {
  getYourResult();
  let answer = word;
  console.log("answer is: " + answer);
  // let commonLetters = ["E", "S", "I", "A", "R",
  //                       "N", "T", "O", "L", "C",
  //                       "D", "U", "P", "M", "G",
  //                       "H", "B", "Y", "F", "V",
  //                       "K", "W", "Z", "X", "Q",
  //                       "J"];
  idx = idx;
  while (numberOfWordsToGuess >= 0) {
    while (answer.includes("*")) {
      // if (answer.includes(commonLetters[idx])) {
      //   idx += 1;
      // }
      console.log("index is: " + idx);
      xhr.open("POST", "https://strikingly-hangman.herokuapp.com/game/on", false);
      console.log("current letter guess is: " + commonLetters[idx]);
      xhr.send(JSON.stringify({sessionId: sessionId, action: action, guess: commonLetters[idx]}));
      console.log("xhr response after guess is: " + xhr.responseText);
      answer = JSON.parse(xhr.responseText).data.word;
      makeGuess(answer, idx += 1);
    }

    if (!answer.includes("*")) {
      numberOfWordsToGuess -= 1;
      giveMeAWord();
    }
  }
}

// step 4) get your result

function getYourResult(action = "getResult") {
  xhr.open("POST", "https://strikingly-hangman.herokuapp.com/game/on", false);
  // console.log("session id is: " + sessionId);
  xhr.send(JSON.stringify({sessionId: sessionId, action: action}));
  console.log("xhr response is: " + xhr.responseText);
}


// step 5) submit result

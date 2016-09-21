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
var bestScore = 0;
var triedGuesses = [];
var file1 = 'file:///Users/TONY/Desktop/strikingly-hangman/sh.txt';
var file2 = 'file:///Users/TONY/Desktop/strikingly-hangman/sh1.txt';
var file3 = 'file:///Users/TONY/Desktop/strikingly-hangman/sh2.txt';
var file4 = 'file:///Users/TONY/Desktop/strikingly-hangman/sh3.txt';
var file5 = 'file:///Users/TONY/Desktop/strikingly-hangman/sh4.txt';

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

startGame();

function readTextFile(fileName) {
  var rawFile = new XMLHttpRequest();
  var allText = '';
  rawFile.open("GET", fileName, false);
  rawFile.onreadystatechange = function() {
    if (rawFile.readyState === 4) {
      if (rawFile.status === 200 || rawFile.status === 0) {
        allText += rawFile.responseText;
      }
    }
  };
  rawFile.send(null);
  return allText.split('\n');
}

// console.log(readTextFile(file1));

function search(givenWord, wordCount) {
  // var funWords = words.filter((word) => word.length <= 5);
  // let regex = /[A-C]/g;
  let list = {};
  let regex = "";
  var funWords;
  let max = 0;
  let guess = null;

  givenWord.split('').forEach(letter => {
    if (letter === "*") {
      regex += "[A-Z]";
    } else {
      regex += letter;
    }
  });

  regex = new RegExp(regex, "gi");

  if (givenWord.length === 3) {
    funWords = readTextFile(file1).filter((word) => {
      if (word.length <= givenWord.length && word.match(regex)) {
        word.split('').forEach(letter => {
          if (list[letter]) {
            list[letter] += 1;
          } else {
            list[letter] = 1;
          }
        });
      }
    });
  } else if (wordCount <= 20) {
    funWords = readTextFile(file2).filter((word) => {
      if (word.length <= givenWord.length && word.match(regex)) {
        word.split('').forEach(letter => {
          if (list[letter]) {
            list[letter] += 1;
          } else {
            list[letter] = 1;
          }
        });
      }
    });
  } else if (wordCount <= 40) {
    funWords = readTextFile(file3).filter((word) => {
      if (word.length <= givenWord.length && word.match(regex)) {
        word.split('').forEach(letter => {
          if (list[letter]) {
            list[letter] += 1;
          } else {
            list[letter] = 1;
          }
        });
      }
    });
  } else if (wordCount <= 60) {
    funWords = readTextFile(file4).filter((word) => {
      if (word.length <= givenWord.length && word.match(regex)) {
        word.split('').forEach(letter => {
          if (list[letter]) {
            list[letter] += 1;
          } else {
            list[letter] = 1;
          }
        });
      }
    });
  } else {
    funWords = readTextFile(file5).filter((word) => {
      if (word.length <= givenWord.length && word.match(regex)) {
        word.split('').forEach(letter => {
          if (list[letter]) {
            list[letter] += 1;
          } else {
            list[letter] = 1;
          }
        });
      }
    });
  }

  Object.keys(list).forEach(key => {
    if (!triedGuesses.includes(key) && list[key] > max) {
      max = list[key];
      guess = key;
    }
  });

  // console.log("most common letter is: " + guess);
  // console.log(list);
  // makeGuess(word, "guessWord", guess);
  return guess;
}

// search("***");
// search("ab*s*");
// word is abask

// step 2) give me a word

// Word Difficulty:
// 1st to 20th word : length <= 5 letters
// 21st to 40th word : length <= 8 letters
// 41st to 60th word : length <= 12 letters
// 61st to 80th word : length > 12 letters

function giveMeAWord(action = "nextWord") {
  triedGuesses = [];
  xhr.open("POST", "https://strikingly-hangman.herokuapp.com/game/on", false);
  xhr.send(JSON.stringify({sessionId: sessionId, action: action}));

  // console.log(JSON.parse(xhr.responseText));
  // console.log(JSON.parse(xhr.responseText).data.word);
  // setTimeout(makeGuess(JSON.parse(xhr.responseText), 200)); // make a guess, pass down unguessed word
  makeGuess(JSON.parse(xhr.responseText));
}

// step 3) make a guess
// ONE character per request, ONLY capital letters.

function makeGuess(resp, action = "guessWord") {
  if (resp.data.totalWordCount === 80) {
    if (resp.data.score > 681) {
      submitResult();
    }
    return;
  }

  let answer = resp.data.word;
  let idx = resp.data.wrongGuessCountOfCurrentWord;
  while (idx < 10  && answer.includes("*")) {
    let nextGuess = search(answer, resp.data.totalWordCount);
    triedGuesses.push(nextGuess);
    xhr.open("POST", "https://strikingly-hangman.herokuapp.com/game/on", false);
    // console.log("current letter guess is: " + nextGuess);
    xhr.send(JSON.stringify({sessionId: sessionId, action: action, guess: nextGuess}));
    console.log("xhr response after guess is: " + xhr.responseText);
    // console.log("xhr status is: " + xhr.status);
    answer = JSON.parse(xhr.responseText).data.word;
    idx ++;
  }

  setTimeout(function() {
    getYourResult();
    giveMeAWord();
  }, 0);
}

// step 4) get your result

function getYourResult(action = "getResult") {
  xhr.open("POST", "https://strikingly-hangman.herokuapp.com/game/on", false);
  xhr.send(JSON.stringify({sessionId: sessionId, action: action}));
  console.log("xhr response is: " + xhr.responseText);
  if (JSON.parse(xhr.responseText).data.score > 1000) {
    // bestScore = JSON.parse(xhr.responseText).data.score;
    // console.log("best score is: " + bestScore);
    submitResult();
  } else if (JSON.parse(xhr.responseText).data.score > bestScore) {
    bestScore = JSON.parse(xhr.responseText).data.score;
    console.log("best score is: " + bestScore);
  }
}


// step 5) submit result

function submitResult() {
  xhr.open("POST", "https://strikingly-hangman.herokuapp.com/game/on", false);
  xhr.send(JSON.stringify({sessionId: sessionId, action: "submitResult"}));
  console.log(xhr.responseText);
}

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

function search(givenWord, wordCount) {
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

  return guess;
}

function giveMeAWord(action = "nextWord") {
  triedGuesses = [];
  xhr.open("POST", "https://strikingly-hangman.herokuapp.com/game/on", false);
  xhr.send(JSON.stringify({sessionId: sessionId, action: action}));

  makeGuess(JSON.parse(xhr.responseText));
}

function makeGuess(resp, action = "guessWord") {
  if (resp.data.totalWordCount === 80) {
    submitResult();
    return;
  }

  let answer = resp.data.word;
  let idx = resp.data.wrongGuessCountOfCurrentWord;
  while (idx < 10  && answer.includes("*")) {
    let nextGuess = search(answer, resp.data.totalWordCount);
    triedGuesses.push(nextGuess);
    xhr.open("POST", "https://strikingly-hangman.herokuapp.com/game/on", false);
    xhr.send(JSON.stringify({sessionId: sessionId, action: action, guess: nextGuess}));
    console.log(xhr.responseText);
    answer = JSON.parse(xhr.responseText).data.word;
    idx ++;
  }

  setTimeout(function() {
    getYourResult();
    giveMeAWord();
  }, 0);
}

function getYourResult(action = "getResult") {
  xhr.open("POST", "https://strikingly-hangman.herokuapp.com/game/on", false);
  xhr.send(JSON.stringify({sessionId: sessionId, action: action}));
  if (JSON.parse(xhr.responseText).data.score > 1000) {
    submitResult();
  } else if (JSON.parse(xhr.responseText).data.score > bestScore) {
    bestScore = JSON.parse(xhr.responseText).data.score;
  }
}

function submitResult() {
  xhr.open("POST", "https://strikingly-hangman.herokuapp.com/game/on", false);
  xhr.send(JSON.stringify({sessionId: sessionId, action: "submitResult"}));
  console.log(xhr.responseText);
}

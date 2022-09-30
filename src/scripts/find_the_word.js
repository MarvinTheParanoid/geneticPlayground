// return a random character
export function randomCharacter() {
  const number_of_characters = 26;
  const a = "a".charCodeAt(0);
  const random_number = Math.floor(Math.random() * number_of_characters);
  return String.fromCharCode(a + random_number);
}

// return a random word of length n
export function randomWord(n) {
  let word = "";
  for (let i = 0; i < n; i++) {
    word += randomCharacter();
  }
  return word;
}

// return the number of correct characters in a word
export function correctCharacters(word, target) {
  let correct = 0;
  for (let i = 0; i < word.length; i++) {
    if (word[i] === target[i]) {
      correct++;
    }
  }
  return correct;
}

// return the levisntein distance between two words

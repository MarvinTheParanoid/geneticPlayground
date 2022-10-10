import BaseModel from "./model";

/**
 * A model for used in the genetic algorithm for generating a target sentence.
 * This isn't particularly useful or interesting, but provides a simple example.
 * @extends BaseModel
 */
export default class SentenceModel extends BaseModel {
  /**
   * Sets the target sentence.
   * @param {string} target_sentence - the target sentence
   * @throws {Error} - if the target sentence is not a valid string
   */
  constructor(target_sentence) {
    super();
    this.characters =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ .,!?\"'";
    this.validate_target_sentence(target_sentence);
    this.target_sentence = target_sentence;
  }

  /**
   * Stops the genetic algorithm when the target sentence is reached.
   * @param {number} fitness_value - the fitness value of the fittest individual
   * @returns {boolean} - true if the fitness value is 0, false otherwise
   */
  stop_function(fitness_value) {
    // Stop when the fitness value is 0 (perfect match)
    return !fitness_value;
  }

  /**
   * Returns the initial population of random sentences.
   * Sentences are of variable length.
   * @param {number} population_size - the number of individuals in the population
   * @returns {Array<Object>} - the initial population
   */
  creation_function(population_size) {
    const min_sentence_length = Math.floor(this.target_sentence.length * 0.5);
    const max_sentence_length = Math.floor(this.target_sentence.length * 2);
    let population = [];
    for (let i = 0; i < population_size; i++) {
      let sentence_length = Math.floor(
        Math.random() * (max_sentence_length - min_sentence_length) +
          min_sentence_length
      );
      let sentence = "";
      for (let j = 0; j < sentence_length; j++) {
        sentence += this.random_character();
      }
      population.push({ sentence });
    }
    return population;
  }

  /**
   * Returns the fitness of an individual by calculating the Levenshtein distance
   * between the individual's sentence and the target sentence.
   * @param {Object} individual - an individual in the population
   * @returns {number} - the fitness of the individual
   */
  fitness_function(individual) {
    return this.levenshteinDistance(individual.sentence, this.target_sentence);
  }

  /**
   * Returns a new individual by joining the first part of the first parent's sentence
   * with the second part of the second parent's sentence, where the split point is
   * randomly chosen for each parent.
   * E.g. if the parents are "hello" and "elephant" and the crossover point is 3 for parent 1 and
   * 5 for parent 2, the child will be "hell" + "nt" -> "hellnt"
   * @param {Object} parent_1 - the first parent
   * @param {Object} parent_2 - the second parent
   */
  crossover_function(parent_1, parent_2) {
    const parent_1_split_point = Math.floor(
      Math.random() * parent_1.sentence.length
    );
    const parent_2_split_point = Math.floor(
      Math.random() * parent_2.sentence.length
    );
    const child_sentence =
      parent_1.sentence.slice(0, parent_1_split_point) +
      parent_2.sentence.slice(parent_2_split_point);
    return { sentence: child_sentence };
  }

  /**
   * Returns a new individual by randomly mutating characters in the individual's sentence.
   * The probability of any given character being mutated is the mutation rate.
   * Therefore the probability of an individual having at least one character mutated is:
   * 1 - (1 - mutation rate)^sentence length.
   * @param {Object} individual - an individual in the population
   * @param {number} mutation_rate - the probability of mutating a character (between 0 and 1)
   * @returns {Object} - the mutated individual
   */
  mutation_function(individual, mutation_rate) {
    return individual.sentence
      .split("")
      .map((character) => {
        // should possible mutations also be deletions and insertions?
        // maybe character/chunk swaps?
        if (Math.random() < mutation_rate) {
          return this.random_character();
        } else {
          return character;
        }
      })
      .join("");
  }

  /**
   * Raises an error if the target sentence is not a valid string.
   * @param {string} target_sentence - the target sentence
   * @throws {Error} - if the target sentence is not a string
   * @throws {Error} - if the target sentence is empty
   * @throws {Error} - if the target sentence contains invalid characters
   */
  validate_target_sentence(target_sentence) {
    if (typeof target_sentence !== "string") {
      throw new Error("target sentence must be a string");
    } else if (target_sentence.length === 0) {
      throw new Error("target sentence must be non-empty");
    } else if (
      target_sentence.split("").some((character) => {
        return !this.characters.includes(character);
      })
    ) {
      throw new Error(
        `target sentence must only contain the characters: ${this.characters}`
      );
    }
  }

  /**
   * Returns a random character (a-z) or a space.
   * @returns {string} - a random character
   */
  random_character() {
    const random_index = Math.floor(Math.random() * this.characters.length);
    return this.characters[random_index];
  }

  /**
   * Calculate the Levenshtein distance between two strings using the dynamic matrix approach.
   * Levenshtein distance is the number of single-character edits (insertions, deletions or substitutions)
   * required to change one string into the other and so can be used as a measure of similarity between two strings.
   * For this implementation, a lower distance is better (0 = identical strings).
   * @param {string} string_1
   * @param {string} string_2
   * @returns {number} - the normalized Levenshtein distance between the two strings
   */
  levenshtein_distance(string_1, string_2) {
    // if both strings are empty, they are identical
    if (string_1.length === 0 && string_2.length === 0) {
      return 0;
    }
    // if either string is empty return 1 (worst possible distance)
    if ((string_1.length === 0) | (string_2.length === 0)) {
      return 1;
    }
    // initialize the distance matrix
    let matrix = [];
    // initialize first row of matrix with 0, 1, 2, ..., string_1.length
    for (let i = 0; i <= string_1.length; i++) {
      matrix[i] = [i];
    }
    // initialize first column of matrix with 0, 1, 2, ..., string_2.length
    for (let j = 0; j <= string_2.length; j++) {
      matrix[0][j] = j;
    }
    // iterate over the matrix and calculate distances
    for (let row = 1; row <= string_1.length; row++) {
      for (let col = 1; col <= string_2.length; col++) {
        // if the characters are the same, the cost is 0 (no edits needed)
        if (string_1[row - 1] === string_2[col - 1]) {
          matrix[row][col] = matrix[row - 1][col - 1];
        } else {
          // otherwise set the value to the minimum of the three adjacent cells
          // plus one (for the edit)
          matrix[row][col] =
            1 +
            Math.min(
              matrix[row - 1][col - 1], // substitution
              matrix[row][col - 1], // insertion
              matrix[row - 1][col] // deletion
            );
        }
      }
    }
    // return the value in the bottom right corner
    // normalized by the length of the longer string
    // TODO: check this normalization
    return (
      matrix[string_1.length][string_2.length] /
      Math.max(string_1.length, string_2.length)
    );
  }
}

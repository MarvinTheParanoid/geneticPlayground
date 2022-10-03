/**
 * Abstract class for generic models.
 * Models are used to provide he an interface for the genetic algorithm to
 * interact with the problem to be solved.
 * All methods except for the stop function are abstract and must be implemented
 * by the subclass.
 * @class Model
 */
export default class BaseClass {
  /**
   * A function that stops the genetic algorithm when it returns true.
   * Useful for stopping the algorithm when a target value is reached.
   * Example: the lowest or highest possible fitness value has been reached.
   * @param {number} fitness_value - the fitness value of the fittest individual
   * @returns {boolean} - whether to stop the genetic algorithm
   */
  stop_function(fitness_value) {
    return false; // default is to never stop
  }

  /**
   * Returns the initial population.
   * The initial population is a set of individuals that are used to start the genetic algorithm.
   * The initial population is usually randomly generated and should include a variety of individuals.
   * @param {number} population_size - the number of individuals in the population
   * @returns {Array<Object>} - the initial population
   */
  creation_function(population_size) {
    throw new Error("Method 'creation_function()' must be implemented.");
  }

  /**
   * Returns the fitness of an individual.
   * The fitness of an individual is a measure of how well it performs in the environment.
   * The goal of the genetic algorithm is to evolve the population to have the highest fitness.
   * @param {Object} individual - an individual in the population
   * @returns {number} - the fitness value of the individual
   */
  fitness_function(individual) {
    throw new Error("Method 'fitness_function()' must be implemented.");
  }

  /**
   * Returns new individual(s) created by crossing over two parents.
   * Crossing over is the process of combining two parents to create new children
   * and is the way information is passed from one generation to the next.
   * Crossover is usually done by selecting a random point in the parents and combining
   * the parents up to that point.
   * @param {Object} parent1 - an individual in the population
   * @param {Object} parent2 - an individual in the population
   * @returns {Array<Object>} - new individual(s) created by crossing over two parents
   */
  crossover_function(parent1, parent2) {
    throw new Error("Method 'crossover_function()' must be implemented.");
  }

  /**
   * Returns a mutated an individual.
   * Mutations are usually small changes to the individual to add variety to the population
   * and prevents the algorithm from getting stuck in a local optimum.
   * @param {Object} individual - an individual in the population
   * @param {number} mutation_rate - the probability of mutation
   * @returns {Object} - the mutated individual
   */
  mutation_function(individual, mutation_rate) {
    throw new Error("Method 'mutation_function()' must be implemented.");
  }
}

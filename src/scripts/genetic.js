// questions
// 1. do I need to add survivors to the next generation?
// 2. do I want to add a score modifier to the fitness function?
// 3. do I want to add a reproduction rate for getting the next generation?
// 5. should initial populations be an object with a value?

import {
  evaluateFitness,
  crossover,
  mutate,
  fittestIndividual,
  weightedSampleWithoutReplacement,
} from "./genetic_functions";

/**
 * A Genetic Algorithm
 * Genetic algorithms are a type of evolutionary algorithm that use natural selection to evolve a population of individuals.
 * Starting with an initial population, the algorithm evolves the population by:
 * 1. Selection: individuals are selected for reproduction based on their fitness
 * 2. Heredity: information is passed from parents to offspring (via crossover)
 * 3. Variation: individuals are mutated to introduce new genetic material (avoids local optima)
 * Over subsequent generations, this process should lead to the evolution of increasingly fit individuals.
 * @param {Object} model - the model defines the problem to be solved and the specifics of how each step of the algorithm is implemented
 * @param {function} model.stop_function - a function that stops the genetic algorithm when it returns true
 * @param {function} model.creation_function - function to create new individuals
 * @param {function} model.fitness_function - function to calculate fitness of an individual
 * @param {function} model.crossover_function - function to create new individual(s) from two parents
 * @param {function} model.mutation_function - function to mutate an individual
 * @param {function} logging_function - (optional) function to log the state of the algorithm at each generation
 * @param {Object} configuration - (optional) configuration options for the algorithm
 * @param {number} configuration.population_size - number of individuals in initial population
 * @param {number} configuration.generations - the maximum number of generations to evolve
 * @param {number} configuration.mutation_rate - probability of mutation
 * @param {number} configuration.survival_rate - proportion of individuals to survive to the next generation
 * @param {number} configuration.reproduction_rate - proportion of individuals to reproduce to the next generation
 * @param {bool} configuration.ascending - whether to maximize or minimize the fitness function
 */
export default function geneticAlgorithm(
  model,
  {
    logging_function = () => {},
    population_size = 100,
    generations = 100,
    mutation_rate = 0.01,
    survival_rate = 0.2,
    reproduction_rate = 1.5,
    ascending = true,
  } = {}
) {
  const {
    creation_function,
    fitness_function,
    crossover_function,
    mutation_function,
    stop_function,
  } = model;
  // keep track of the population for each generation
  let history = [];
  // create the initial population
  let population = creation_function(population_size);
  // create subsequent generations until we reach the maximum number of generations
  for (let generation = 0; generation < generations; generation++) {
    // evaluate the fitness of the population
    population = evaluateFitness(population, fitness_function);
    // add population to history and log the history
    history.push(population);
    logging_function(history);
    // check if we should stop early (e.g. optimal solution found)
    if (stop_function(fittestIndividual(population, ascending).fitness)) {
      break;
    }
    // create a mating pool from the population
    let number_of_survivors = Math.floor(population.length * survival_rate);
    let mating_pool = weightedSampleWithoutReplacement(
      population,
      number_of_survivors,
      ascending
    );
    // create the next generation via crossover
    let number_of_children = Math.floor(population.length * reproduction_rate);
    let next_generation = crossover(
      mating_pool,
      number_of_children,
      crossover_function,
      ascending
    );
    // add random mutations to the next generation
    next_generation = mutate(next_generation, mutation_function, mutation_rate);
    // set the population to the next generation
    population = next_generation;
  }
  // return the history of the population
  return {
    history,
    fittest: fittestIndividual(population, ascending),
  };
}

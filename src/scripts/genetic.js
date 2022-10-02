import {
  randomPopulation,
  evaluateFitness,
  crossover,
  mutate,
  fittestIndividual,
  weightedSampleWithoutReplacement,
} from "./genetic_functions";
// questions
// 1. do I need to add survivors to the next generation?
// 2. do I want to add a score modifier to the fitness function?
// 3. do I want to add a reproduction rate for getting the next generation?
// 4. do I need to add default values for stop_value and target_value?
// 5. should initial populations be an object with a value?

// a genetic algorithm
export function geneticAlgorithm(
  model,
  logging_function = () => {},
  configuration = {
    population_size: 100,
    generations: 100,
    mutation_rate: 0.01,
    survival_rate: 0.2,
    reproduction_rate: 1.5,
  }
) {
  const {
    population_size,
    generations,
    mutation_rate,
    survival_rate,
    reproduction_rate,
  } = configuration;
  const {
    creation_function,
    fitness_function,
    crossover_function,
    mutation_function,
    stop_value,
    target_value,
  } = model;
  let history = [];
  // create the initial population
  let population = randomPopulation(population_size, creation_function);
  // create new generations until we reach the maximum number of generations
  for (let generation = 0; generation < generations; generation++) {
    // evaluate the fitness of the population
    population = evaluateFitness(population, fitness_function, target_value);
    // add population to history and log the history
    history.push(population);
    logging_function(history);
    // check if we have reached the stop value
    if (fittestIndividual(population).fitness === stop_value) {
      break;
    }
    // create a mating pool from the population
    let number_of_survivors = Math.floor(population.length * survival_rate);
    let mating_pool = weightedSampleWithoutReplacement(
      population,
      number_of_survivors
    );
    // create the next generation via crossover
    let number_of_children = Math.floor(population.length * reproduction_rate);
    let next_generation = crossover(
      mating_pool,
      number_of_children,
      crossover_function
    );
    // add random mutations to the next generation
    next_generation = mutate(next_generation, mutation_function, mutation_rate);
    // set the population to the next generation
    population = next_generation;
  }
}

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

// return a random population of size n
export function randomPopulation(n, creation_function) {
  return Array.from({ length: n }, () => creation_function());
}

// return the fitness of individuals in a population
export function evaluateFitness(population, fitness_function, target_value) {
  return population.map((value) => ({
    value,
    fitness: fitness_function(value, target_value),
  }));
}

// return a new population of size n by crossing over individuals randomly sampled from the population weighted by fitness
export function crossover(population, n, crossover_function) {
  // raises an error if the population size is less than 2
  if (population.length < 2) {
    throw new Error("population size must be greater than 1");
  }
  const new_population = [];
  for (let i = 0; i < n; i++) {
    // it might be interesting to implement monogamy, polygamy, multiple children, etc.
    const [parent1, parent2] = weightedSampleWithoutReplacement(population, 2);
    new_population.push(crossover_function(parent1.value, parent2.value));
  }
  return new_population;
}

// randomly mutate individuals in a population
export function mutate(population, mutation_function, mutation_rate) {
  return population.map((individual) =>
    mutation_function(individual, mutation_rate)
  );
}

// return the best individual in a population
export function fittestIndividual(population) {
  const fitness = population.map((individual) => individual.fitness);
  const index = fitness.indexOf(Math.max(...fitness));
  return population[index];
}

// return a random sample without replacement weighted by fitness
export function weightedSampleWithoutReplacement(population, n) {
  // raises an error if n is greater than the population size
  if (n > population.length) {
    throw new Error("n must be less than or equal to the population size");
  }
  // get weights based on relative fitness of individuals
  const weights = relativeCumulativeFitness(population);
  // get n unique indices
  const indices = randomUniqueIndices(weights, n);
  // return the individuals at the indices
  // subtract 1 from the indices because the weights array has an extra element at the beginning
  return indices.map((index) => population[index - 1]);
}

// return relative cumulative fitness of a population
export function relativeCumulativeFitness(population) {
  const fitness = population.map((individual) => individual.fitness);
  const total_fitness = fitness.reduce(
    (total, individual) => total + individual,
    0
  );
  const relative_fitness = fitness.map(
    (individual) => individual / total_fitness
  );
  // return the cumulative sum of the relative fitness
  return relative_fitness.reduce(
    (store, current, index) => [...store, store[index] + current],
    [0]
  );
}

// returns n unique random indices based on relative weights
export function randomUniqueIndices(weights, n) {
  // raise an error if n is less than zero or greater than the population size
  // population size is the length of the weights array minus 1
  if (n < 0 || n > weights.length) {
    throw new Error("n must be between 0 and the population size");
  }
  // get n unique indices
  const indices = [];
  while (indices.length < n) {
    const random_number = Math.random();
    const index = weights.findIndex((f) => f > random_number);
    if (!indices.includes(index)) {
      indices.push(index);
    }
  }
  return indices;
}

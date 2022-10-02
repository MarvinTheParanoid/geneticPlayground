/**
 * Questions:
 * 1. What do we wanted to do with negative and zero fitness values?
 *    - they have zero probability of being selected? OR
 *    - do we want to give them a small probability of being selected? (relative to the rest)
 */

/**
 * Creates an initial population of n random individuals
 * @param {number} n - number of individuals in initial population
 * @param {function} creation_function - function to create an individual
 * @returns {array<Object>} - array of individuals
 */
export function randomPopulation(n, creation_function) {
  return Array.from({ length: n }, () => creation_function());
}

/**
 *  Add a fitness property to each individual in the population
 * @param {Array<Object>} population - array of individuals
 * @param {function} fitness_function - function to calculate fitness of an individual
 * @param {*} target_value - target value to be evaluated against (if applicable)
 * @returns {Array<Object>} - array of individuals with a fitness property
 */
export function evaluateFitness(population, fitness_function, target_value) {
  return population.map((individual) => ({
    ...individual,
    fitness: fitness_function(individual, target_value),
  }));
}

/**
 * Return a new population by crossing over individuals picked by random weighted sampling by fitness
 * @param {Array<Object>} population - array of individuals
 * @param {number} n - number of individuals in new population
 * @param {function} crossover_function - a function to create a new individual from two parents
 * @param {bool} ascending - whether to maximize or minimize the fitness function
 * @returns {Array<Object>} - the next generation of individuals
 */
export function crossover(population, n, crossover_function, ascending) {
  // raises an error if the population size is less than 2
  if (population.length < 2) {
    throw new Error("population size must be greater than 1");
  }
  const new_population = [];
  for (let i = 0; i < n; i++) {
    // it might be interesting to implement monogamy, polygamy, multiple children, etc.
    const [parent1, parent2] = weightedSampleWithoutReplacement(
      population,
      2,
      ascending
    );
    new_population.push(crossover_function(parent1, parent2));
  }
  return new_population;
}

/**
 * Randomly adds mutations to individuals in a population
 * @param {Array<Object>} population - array of individuals
 * @param {function} mutation_function - function to mutate an individual
 * @param {number} mutation_rate - probability of mutation
 * @returns {Array<Object>} - array of individuals with mutations
 */
export function mutate(population, mutation_function, mutation_rate) {
  return population.map((individual) =>
    mutation_function(individual, mutation_rate)
  );
}

/**
 * Returns the fittest individual in a population
 * @param {Array<Object>} population - array of individuals
 * @param {bool} ascending - whether to maximize or minimize the fitness function
 * @returns {Object} - individual with highest fitness
 */
export function fittestIndividual(population, ascending) {
  const fitness = population.map((individual) => individual.fitness);
  const index = ascending
    ? fitness.indexOf(Math.max(...fitness))
    : fitness.indexOf(Math.min(...fitness));
  return population[index];
}

/**
 * Return a random sample without replacement weighted by fitness
 * @param {Array<Object>} population - array of individuals
 * @param {number} n - number of individuals to sample
 * @param {bool} ascending - whether to maximize or minimize the fitness function
 * @returns {Array<Object>} - array of sampled individuals
 */
export function weightedSampleWithoutReplacement(population, n, ascending) {
  // raises an error if n is greater than the population size
  if (n > population.length) {
    throw new Error("n must be less than or equal to the population size");
  }
  // get weights based on relative fitness of individuals
  const weights = relativeCumulativeFitness(population, ascending);
  // get n unique indices
  const indices = randomUniqueIndices(weights, n);
  // return the individuals at the indices
  return indices.map((index) => population[index]);
}

/**
 * Return an array of relative cumulative fitness of a population
 * @param {Array<Object>} population
 * @param {bool} ascending - whether to maximize or minimize the fitness function
 * @returns {Array<number>} - array of relative cumulative fitness
 */
export function relativeCumulativeFitness(population, ascending) {
  // get the fitness values for all individuals
  let fitness = population.map((individual) => individual.fitness);
  // if any value is negative, add absolute value of min to all values to make all positive
  if (fitness.some((value) => value < 0)) {
    const min = Math.min(...fitness);
    fitness = fitness.map((value) => value + Math.abs(min));
  }
  // if any values are 0, add 1 to all values to avoid division by 0
  if (fitness.some((value) => value === 0)) {
    fitness = fitness.map((value) => value + 1);
  }
  // if ascending is false, use 1 / fitness to invert the values
  if (!ascending) {
    fitness = fitness.map((value) => 1 / value);
  }
  // normalize the values
  const total_fitness = fitness.reduce(
    (total, individual) => total + individual,
    0
  );
  const relative_fitness = fitness.map(
    (individual) => individual / total_fitness
  );
  // return the cumulative sum of the relative fitness values
  return relative_fitness.reduce(
    (cumulative, individual, index) => [
      ...cumulative,
      individual + (cumulative[index - 1] || 0),
    ],
    []
  );
}

/**
 * Returns n unique random indices based on relative weights
 * @param {Array<number>} weights - array of relative cumulative fitness for a population
 * @param {number} n - number of indices to return
 * @returns {Array<number>} - array of unique indices
 */
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

// questions
// 1. do I need to add survivors to the next generation?
// 2. do I want to add a score modifier to the fitness function?
// 3. do I want to add a reproduction rate for getting the next generation?
// 4. do I want to keep a full history of each generation? Or just the best/average?

// a genetic algorithm
export function geneticAlgorithm(
  model,
  target,
  configuration = {
    population_size: 100,
    generations: 100,
    mutation_rate: 0.01,
    survival_rate: 0.2,
    reproduction_rate: 0.5,
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
  } = model;

  // initialize the initial population
  let population = randomPopulation(population_size, creation_function);
  // get the fitness of the initial population
  population = evaluateFitness(
    population,
    fitness_function,
    target ? target : population
  );
  // create new generations until we reach the maximum number of generations
  for (
    let generation = 0;
    (generation < generations) & population;
    generation++
  ) {
    // create a mating pool
    let mating_pool = weightedSample(population, survival_rate);
    // create the next generation via crossover
    let next_generation = crossover(
      mating_pool,
      reproduction_rate,
      crossover_function
    );
    // add random mutations to the next generation
    next_generation = mutate(next_generation, mutation_function, mutation_rate);
    // evaluate the fitness of the next generation
    next_generation = evaluateFitness(
      next_generation,
      fitness_function,
      target ? target : population
    );
    // get the best individual and average fitness from this generation
    let best_individual = bestIndividual(next_generation);
    let average_fitness = averageFitness(next_generation);
    console.log(
      `Best: ${best_individual.value}, Score ${bestIndividual.fitness}`
    );
    console.log(
      `Population Size: ${next_generation.length}, Average Score: ${average_fitness}`
    );
    // set the population to the next generation
    population = next_generation;
  }
}

// return a random population of size n
export function randomPopulation(n, creation_function) {
  return Array.from({ length: n }, () => creation_function());
}

// return the fitness of individuals in a population
export function evaluateFitness(population, fitness_function, target) {
  return population.map((value) => ({
    value,
    fitness: fitness_function(value, target),
  }));
}

// return a randomly sample from a population weighted by fitness
export function weightedSample(population, n) {
  const fitness = population.map((individual) => individual.fitness);
  // get weights
  const total_fitness = fitness.reduce((a, b) => a + b, 0);
  const relative_fitness = fitness.map(
    (individual) => individual / total_fitness
  );
  const cumulative_fitness = relative_fitness.reduce(
    (store, current, index) => [...store, store[index] + current],
    [0]
  );
  // get a random weighted sample of size n
  return Array.from({ length: n }, () => {
    const random_number = Math.random();
    const index = cumulative_fitness.findIndex((f) => f > random_number);
    return population[index];
  });
}

// return a new population of size n by crossing over individuals randomly sampled from the population weighted by fitness
export function crossover(population, n, crossover_function) {
  const new_population = [];
  for (let i = 0; i < n; i++) {
    const [parent1, parent2] = weightedSample(population, 2);
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
export function bestIndividual(population) {
  const fitness = population.map((individual) => individual.fitness);
  const index = fitness.indexOf(Math.max(...fitness));
  return population[index];
}

// return the average fitness of a population
export function averageFitness(fitness) {
  return (
    fitness.reduce((total, individual) => total + individual.fitness, 0) /
    fitness.length
  );
}

import * as genetic from "./genetic_functions";
import { mockRandom, resetMockRandom } from "jest-mock-random";

describe("randomPopulation", () => {
  test("returns an array of length n", () => {
    const population = genetic.randomPopulation(100, () => 1);
    expect(population).toBeInstanceOf(Array);
    expect(population.length).toBe(100);
  });
  test("calls the creation function n times", () => {
    const creation_function = jest.fn();
    genetic.randomPopulation(100, creation_function);
    expect(creation_function).toHaveBeenCalledTimes(100);
  });
  test("returns an array of the values returned by the creation function", () => {
    const population = genetic.randomPopulation(100, () => 1);
    expect(population.every((individual) => individual === 1)).toBe(true);
  });
});

describe("evaluateFitness", () => {
  test("returns an array of individuals with fitness values", () => {
    const population = [{ value: 1 }, { value: 2 }, { value: 3 }];
    const fitness_function = (individual) => individual.value;
    const evaluated_population = genetic.evaluateFitness(
      population,
      fitness_function
    );
    expect(evaluated_population).toEqual([
      { value: 1, fitness: 1 },
      { value: 2, fitness: 2 },
      { value: 3, fitness: 3 },
    ]);
  });
  test("calls the fitness function on each individual", () => {
    const population = [{ value: 1 }, { value: 2 }, { value: 3 }];
    const fitness_function = jest.fn();
    genetic.evaluateFitness(population, fitness_function);
    expect(fitness_function).toHaveBeenCalledTimes(3);
    expect(fitness_function).toHaveBeenCalledWith({ value: 1 }, undefined);
    expect(fitness_function).toHaveBeenCalledWith({ value: 3 }, undefined);
  });
  test("uses the target value if provided", () => {
    const population = [{ value: 1 }, { value: 2 }, { value: 3 }];
    const fitness_function = (individual, target) => individual.value + target;
    const evaluated_population = genetic.evaluateFitness(
      population,
      fitness_function,
      10
    );
    expect(evaluated_population).toEqual([
      { value: 1, fitness: 11 },
      { value: 2, fitness: 12 },
      { value: 3, fitness: 13 },
    ]);
  });
});

describe("fittestIndividual", () => {
  test("returns the individual with the highest fitness", () => {
    const population = [
      { value: 1, fitness: 1 },
      { value: 2, fitness: 2 },
      { value: 3, fitness: 3 },
      { value: 4, fitness: 4 },
      { value: 5, fitness: 5 },
    ];
    const best_individual = genetic.fittestIndividual(population);
    expect(best_individual).toEqual({ value: 5, fitness: 5 });
  });
});

describe("mutate", () => {
  test("returns an array the same length as the population", () => {
    const population = [
      { value: 1, fitness: 1 },
      { value: 2, fitness: 2 },
      { value: 3, fitness: 3 },
      { value: 4, fitness: 4 },
      { value: 5, fitness: 5 },
    ];
    const mutation_function = () => 1;
    const mutated_population = genetic.mutate(
      population,
      mutation_function,
      0.01
    );
    expect(mutated_population).toBeInstanceOf(Array);
    expect(mutated_population.length).toBe(population.length);
  });
  test("calls the mutation function on each individual", () => {
    const population = [
      { value: 1, fitness: 1 },
      { value: 2, fitness: 2 },
      { value: 3, fitness: 3 },
      { value: 4, fitness: 4 },
      { value: 5, fitness: 5 },
    ];
    const mutation_function = (individual, mutation_rate) =>
      individual.value * mutation_rate;
    const mutated_population = genetic.mutate(
      population,
      mutation_function,
      10
    );
    expect(mutated_population).toEqual([10, 20, 30, 40, 50]);
  });
});

describe("relativeCumulativeFitness", () => {
  test("returns an array that is of length population length + 1", () => {
    const population = [
      { value: 1, fitness: 1 },
      { value: 2, fitness: 2 },
      { value: 3, fitness: 3 },
      { value: 4, fitness: 4 },
      { value: 5, fitness: 5 },
    ];
    const relative_fitness = genetic.relativeCumulativeFitness(population);
    expect(relative_fitness).toBeInstanceOf(Array);
    // + 1 because the first element is 0
    expect(relative_fitness.length).toEqual(population.length + 1);
  });
  test("returned array has expected values", () => {
    const population = [
      { value: 1, fitness: 1 },
      { value: 2, fitness: 2 },
      { value: 3, fitness: 3 },
      { value: 4, fitness: 4 },
    ];
    const relative_fitness = genetic.relativeCumulativeFitness(population);
    const expected_values = [0, 0.1, 0.3, 0.6, 1];
    relative_fitness.forEach((value, index) => {
      // handle floating point precision errors
      expect(value).toBeCloseTo(expected_values[index]);
    });
  });
});

describe("randomUniqueIndices", () => {
  test("returns an array of length n", () => {
    const weights = [0, 0.1, 0.3, 0.6, 1];
    const indices = genetic.randomUniqueIndices(weights, 3);
    expect(indices).toBeInstanceOf(Array);
    expect(indices.length).toBe(3);
  });
  test("returned indices are unique", () => {
    const weights = [0, 0.1, 0.3, 0.6, 1];
    mockRandom([0.1, 0.1, 0.38, 0.95]);
    const indices = genetic.randomUniqueIndices(weights, 3);
    const unique_indices = new Set(indices);
    expect(unique_indices.size).toBe(indices.length);
    resetMockRandom();
  });
  test("returned indices are within the range of the weights array", () => {
    const weights = [0, 0.1, 0.3, 0.6, 1];
    const indices = genetic.randomUniqueIndices(weights, 3);
    indices.forEach((index) => {
      expect(index).toBeGreaterThanOrEqual(0);
      expect(index).toBeLessThan(weights.length);
      expect(index % 1).toBe(0);
    });
  });
  test("the random number is mapped to the correct index", () => {
    const weights = [0, 0.1, 0.3, 0.6, 1];
    mockRandom([0.05, 0.1, 0.38, 0.95]);
    const indices = genetic.randomUniqueIndices(weights, 4);
    expect(indices).toEqual([1, 2, 3, 4]);
    resetMockRandom();
  });
});

describe("weightedSampleWithoutReplacement", () => {
  test("raises an error if n is greater than the population size", () => {
    const population = [
      { value: 1, fitness: 1 },
      { value: 2, fitness: 2 },
    ];
    expect(() =>
      genetic.weightedSampleWithoutReplacement(population, 3)
    ).toThrowError("n must be less than or equal to the population size");
  });
  test("returns an array of length n", () => {
    const population = [
      { value: 1, fitness: 1 },
      { value: 2, fitness: 2 },
    ];
    const sample = genetic.weightedSampleWithoutReplacement(population, 1);
    expect(sample).toBeInstanceOf(Array);
    expect(sample.length).toBe(1);
  });
  test("returns the correct sample", () => {
    const population = [
      { value: 1, fitness: 1 }, // 0.1
      { value: 2, fitness: 2 }, // 0.3
      { value: 3, fitness: 3 }, // 0.6
      { value: 4, fitness: 4 }, // 1
    ];
    mockRandom([0.01, 0.05, 0.38]);
    const sample = genetic.weightedSampleWithoutReplacement(population, 2);
    expect(sample).toEqual([population[0], population[2]]);
    resetMockRandom();
  });
});

describe("crossover", () => {
  test("raises an error if the population size is less than 2", () => {
    const population = [{ value: 1, fitness: 1 }];
    const crossover_function = jest.fn();
    expect(() =>
      genetic.crossover(population, 1, crossover_function)
    ).toThrowError("population size must be greater than 1");
  });
  test("returns an array of length n", () => {
    const population = [
      { value: 1, fitness: 1 },
      { value: 2, fitness: 2 },
      { value: 3, fitness: 3 },
      { value: 4, fitness: 4 },
      { value: 5, fitness: 5 },
    ];
    const crossover_function = () => 1;
    const children = genetic.crossover(population, 10, crossover_function);
    expect(children).toBeInstanceOf(Array);
    expect(children.length).toBe(10);
  });
  test("returns the result of the crossover_function called on pairs", () => {
    const population = [
      { value: 1, fitness: 1 }, // 0.1
      { value: 2, fitness: 2 }, // 0.3
      { value: 3, fitness: 3 }, // 0.6
      { value: 4, fitness: 4 }, // 1
    ];
    mockRandom([0, 0.2, 0.5, 0.95]);
    const crossover_function = (parent_1, parent_2) => ({
      value: parent_1.value + parent_2.value,
    });
    const children = genetic.crossover(population, 2, crossover_function);
    expect(children).toEqual([{ value: 3 }, { value: 7 }]);
    resetMockRandom();
  });
});

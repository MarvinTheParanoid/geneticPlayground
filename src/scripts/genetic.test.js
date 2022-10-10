import genetic from "./genetic";
import BaseModel from "./models/model";
import { mockRandom, resetMockRandom } from "jest-mock-random";

class TestModel extends BaseModel {
  creation_function(population_size) {
    return [
      { value: "aabb" },
      { value: "bbaa" },
      { value: "abab" },
      { value: "ccdd" },
      { value: "ddcc" },
    ];
  }
  fitness_function(individual) {
    return individual.value
      .split("")
      .reduce((total, current) => total + (current === "a" ? 1 : 0), 0);
  }
  crossover_function(individual1, individual2) {
    return [
      {
        value: individual1.value.slice(0, 2) + individual2.value.slice(2, 4),
      },
    ];
  }
  mutation_function(individual, mutation_rate) {
    let value = [];
    individual.value.split("").forEach((char) => {
      if (Math.random() < mutation_rate) {
        value.push(char === "a" ? "b" : "a");
      } else {
        value.push(char);
      }
    });
    return { value: value.join("") };
  }
  stop_function(fitness) {
    return fitness === 4;
  }
}

describe("genetic", () => {
  beforeEach(() => {
    mockRandom([0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9]);
  });
  afterEach(() => {
    resetMockRandom();
  });
  it("should return the fittest individual", () => {
    const model = new TestModel();
    // const logging_function = (x) => console.log(x);
    const { fittest } = genetic(model, {
      // logging_function,
      generations: 10,
      survival_rate: 0.5,
      reproduction_rate: 1,
    });
  });
  expect(true).toBe(true);
});

/**
 * rethink having multiple children
 * check if 2 children is the norm
 * check survival rate is maintained with 2+ children
 *
 */

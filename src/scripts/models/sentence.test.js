import SentenceModel from "./sentence";
import { mockRandom, resetMockRandom } from "jest-mock-random";

describe("SentenceModel", () => {
  describe("constructor", () => {
    it("should set the target sentence", () => {
      const target_sentence = "Hello, world!";
      const sentence_model = new SentenceModel(target_sentence);
      expect(sentence_model.target_sentence).toEqual(target_sentence);
    });

    it("should call the validate_target_sentence method", () => {
      const target_sentence = "Hello, world!";
      const validate_target_sentence = jest.spyOn(
        SentenceModel.prototype,
        "validate_target_sentence"
      );
      const sentence_model = new SentenceModel(target_sentence);
      expect(validate_target_sentence).toHaveBeenCalledWith(target_sentence);
      validate_target_sentence.mockRestore();
    });

    it("should throw an error if the target sentence is not a string", () => {
      const target_sentence = 123;
      expect(() => new SentenceModel(target_sentence)).toThrow(
        "target sentence must be a string"
      );
    });
  });
  describe("validate_target_sentence", () => {
    const sentence_model = new SentenceModel("Hello, world!");
    it("should throw an error if the target sentence is not a string", () => {
      const target_sentence = 123;
      expect(() =>
        sentence_model.validate_target_sentence(target_sentence)
      ).toThrow("target sentence must be a string");
    });
    it("should throw an error if the target sentence is empty", () => {
      const target_sentence = "";
      expect(() =>
        sentence_model.validate_target_sentence(target_sentence)
      ).toThrow("target sentence must be non-empty");
    });
    it("should throw an error if the target sentence contains invalid characters", () => {
      // assuming * is not a valid character
      const target_sentence = "Hello, world!*";
      expect(() =>
        sentence_model.validate_target_sentence(target_sentence)
      ).toThrow("target sentence must only contain the characters:");
    });
    it("should not throw an error if the target sentence is valid", () => {
      const target_sentence = "Hello, world!";
      expect(() =>
        sentence_model.validate_target_sentence(target_sentence)
      ).not.toThrow();
    });
  });
  describe("random_character", () => {
    const sentence_model = new SentenceModel("Hello, world!");
    it("should return a character", () => {
      const random_character = sentence_model.random_character();
      expect(typeof random_character).toEqual("string");
      expect(random_character.length).toEqual(1);
    });
    it("should return a character from the characters array", () => {
      const random_character = sentence_model.random_character();
      expect(sentence_model.characters).toContain(random_character);
    });
    it("should be random", () => {
      mockRandom([0.0, 0.999]);
      const random_character_1 = sentence_model.random_character();
      expect(random_character_1).toBe(sentence_model.characters[0]);
      const random_character_2 = sentence_model.random_character();
      expect(random_character_2).toBe(
        sentence_model.characters[sentence_model.characters.length - 1]
      );
      resetMockRandom();
    });
  });
});

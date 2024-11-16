import { type Formula } from "./formula";

export type ProofLine = {
  line: number;
  assumptions: number[];
  formula: Formula;
  rule: Rule;
  references: number[];
};

export abstract class Rule {
  abstract checkLineCount(lines: ProofLine[]): void;

  /**
   *
   * @param lines The proof lines involved in the rule.
   */
  abstract checkReferences(lines: ProofLine[]): void;

  abstract checkAssumptions(lines: ProofLine[]): void;

  abstract checkFormulas(lines: ProofLine[]): void;

  abstract toString(): string;

  validate(lines: ProofLine[]) {
    this.checkLineCount(lines);
    this.checkReferences(lines);
    this.checkAssumptions(lines);
    this.checkFormulas(lines);
  }
}

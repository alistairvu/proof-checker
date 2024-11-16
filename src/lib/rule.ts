import { Conjunction, type Formula } from "./formula";

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
    this.checkReferences(lines);
    this.checkAssumptions(lines);
    this.checkFormulas(lines);
  }
}

// Conjunction Elimination
export class AndElim extends Rule {
  toString() {
    return "∧ Elim";
  }

  checkLineCount(lines: ProofLine[]) {
    if (lines.length !== 2) {
      throw new Error("∧ Elim operates on two lines");
    }
  }

  checkReferences(lines: ProofLine[]) {
    const [first, second] = lines;

    if (first === undefined || second === undefined) {
      throw new Error("∧ Elim operates on two lines");
    }

    if (second.references.length !== 1) {
      throw new Error("∧ Elim only accepts one reference");
    }

    if (second.references[0] !== first.line) {
      throw new Error("Incorrect set of references.");
    }
  }

  checkAssumptions(lines: ProofLine[]): void {
    const [first, second] = lines;

    if (first === undefined || second === undefined) {
      throw new Error("∧ Elim operates on two lines");
    }

    if (first.assumptions.length !== second.assumptions.length) {
      throw new Error("Incorrect set of assumptions");
    }

    for (const assumption of first.assumptions) {
      if (!second.assumptions.includes(assumption)) {
        throw new Error("Incorrect set of assumptions");
      }
    }
  }

  checkFormulas(lines: ProofLine[]): void {
    const [first, second] = lines;

    if (first === undefined || second === undefined) {
      throw new Error("∧ Elim operates on two lines");
    }

    if (!(first.formula instanceof Conjunction)) {
      throw new Error(
        `Line ${first.line} must be a conjunction to apply rule ${this.toString()}`,
      );
    }

    const [left, right] = first.formula.getChildren();

    if (second.formula !== left && second.formula !== right) {
      throw new Error(
        `Cannot apply rule ${this.toString()} with formulae ${first.formula.toString()} and ${second.formula.toString()}`,
      );
    }
  }
}

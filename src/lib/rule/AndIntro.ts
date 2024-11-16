import { Conjunction } from "../formula";
import { Rule, type ProofLine } from "../rule";

// Conjunction Introduction
export class AndIntro extends Rule {
  toString() {
    return "∧ Intr";
  }

  checkLineCount(lines: ProofLine[]) {
    if (lines.length !== 3) {
      throw new Error("∧ Intro operates on three lines");
    }
  }

  checkReferences(lines: ProofLine[]) {
    const [first, second, third] = lines;

    if (first === undefined || second === undefined || third === undefined) {
      throw new Error("∧ Intro operates on three lines");
    }

    if (third.references.length !== 2) {
      throw new Error("∧ Intro accepts exactly two references");
    }

    if (
      third.references[0] !== first.line ||
      third.references[0] !== second.line
    ) {
      throw new Error("Incorrect set of references.");
    }
  }

  checkAssumptions(lines: ProofLine[]): void {
    const [first, second, third] = lines;

    if (first === undefined || second === undefined || third === undefined) {
      throw new Error("∧ Elim operates on two lines");
    }

    if (first.assumptions.length !== second.assumptions.length) {
      throw new Error("Incorrect set of assumptions");
    }

    for (const assumption of third.assumptions) {
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

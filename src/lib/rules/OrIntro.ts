import { Disjunction } from "../formula";
import { Rule, type ProofLine } from "../rule";

// Disjunction Introduction
export class OrIntro extends Rule {
  toString() {
    return "∨ Intr";
  }

  checkLineCount(lines: ProofLine[]) {
    if (lines.length !== 2) {
      throw new Error(`${this.toString()} involves two lines.`);
    }
  }

  checkReferences(lines: ProofLine[]) {
    const [first, second] = lines as [ProofLine, ProofLine];

    if (second?.references.length !== 1) {
      throw new Error(`${this.toString()} only accepts one reference.`);
    }

    if (second?.references[0] !== first?.line) {
      throw new Error("Incorrect set of references.");
    }
  }

  checkAssumptions(lines: ProofLine[]): void {
    const [first, second] = lines as [ProofLine, ProofLine];

    if (first.assumptions.length !== second.assumptions.length) {
      throw new Error("Incorrect set of assumptions.");
    }

    for (const assumption of first.assumptions) {
      if (!second.assumptions.includes(assumption)) {
        throw new Error("Incorrect set of assumptions.");
      }
    }
  }

  checkFormulas(lines: ProofLine[]): void {
    const [first, second] = lines as [ProofLine, ProofLine];

    if (!(second.formula instanceof Disjunction)) {
      throw new Error(
        `Line ${second.line} must be a disjunction to apply rule ${this.toString()}.`,
      );
    }

    const [left, right] = second.formula.getChildren();

    if (!left?.equals(first.formula) && !right?.equals(first.formula)) {
      throw new Error(
        `Cannot apply rule ${this.toString()} with formulae ${first.formula.toString()} and ${second.formula.toString()}.`,
      );
    }
  }
}

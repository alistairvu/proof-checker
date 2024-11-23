import { Implication } from "../formula";
import { Rule, type ProofLine } from "../rule";

// Implication Elimination
export class ToElim extends Rule {
  toString() {
    return "Implication Elimination";
  }

  checkLineCount(lines: ProofLine[]) {
    if (lines.length !== 3) {
      throw new Error(`${this.toString()} involves exactly three lines.`);
    }
  }

  checkReferences(lines: ProofLine[]) {
    const [first, second, third] = lines as [ProofLine, ProofLine, ProofLine];

    if (third.references.length !== 2) {
      throw new Error(`${this.toString()} accepts exactly two references.`);
    }

    if (
      third.references[0] !== first.line ||
      third.references[1] !== second.line
    ) {
      throw new Error("Incorrect set of references.");
    }
  }

  checkAssumptions(lines: ProofLine[]): void {
    const [first, second, third] = lines as [ProofLine, ProofLine, ProofLine];

    for (const assumption of first.assumptions) {
      if (!third.assumptions.includes(assumption)) {
        throw new Error(
          `Incorrect set of assumptions: ${assumption} not found in line ${third.line}.`,
        );
      }
    }

    for (const assumption of second.assumptions) {
      if (!third.assumptions.includes(assumption)) {
        throw new Error(
          `Incorrect set of assumptions: ${assumption} not found in line ${third.line}.`,
        );
      }
    }

    for (const assumption of third.assumptions) {
      if (
        !first.assumptions.includes(assumption) &&
        !second.assumptions.includes(assumption)
      ) {
        throw new Error("Incorrect set of assumptions.");
      }
    }
  }

  checkFormulas(lines: ProofLine[]): void {
    const [first, second, third] = lines as [ProofLine, ProofLine, ProofLine];

    if (!(first.formula instanceof Implication)) {
      throw new Error(
        `Line ${second.line} must be an implication to apply rule ${this.toString()}.`,
      );
    }

    const [left, right] = first.formula.getChildren();

    if (!left?.equals(second.formula) || !right?.equals(third.formula)) {
      throw new Error(
        `Cannot apply rule ${this.toString()} with formulae ${first.formula.toString()}, ${second.formula.toString()} and ${third.formula.toString()}`,
      );
    }
  }
}

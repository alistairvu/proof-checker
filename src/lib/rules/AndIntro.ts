import { Conjunction } from "../formula";
import { Rule, type ProofLine } from "../rule";

// Conjunction Introduction
export class AndIntro extends Rule {
  toString() {
    return "Conjunction Introduction";
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
      third.references[1] !== second.line
    ) {
      throw new Error("Incorrect set of references.");
    }
  }

  checkAssumptions(lines: ProofLine[]): void {
    const [first, second, third] = lines;

    if (first === undefined || second === undefined || third === undefined) {
      throw new Error("∧ Elim operates on two lines");
    }

    const target = new Set(first.assumptions);

    for (const val of second.assumptions) {
      target.add(val);
    }

    if (third.assumptions.length !== target.size) {
      throw new Error("Incorrect set of assumptions");
    }

    for (const assumption of third.assumptions) {
      if (!target.has(assumption)) {
        throw new Error("Incorrect set of assumptions");
      }
    }
  }

  checkFormulas(lines: ProofLine[]): void {
    const [first, second, third] = lines as [ProofLine, ProofLine, ProofLine];

    if (!(third.formula instanceof Conjunction)) {
      throw new Error(
        `Line ${first.line} must be a conjunction to apply rule ${this.toString()}`,
      );
    }

    const [left, right] = third.formula.getChildren();

    console.log(left?.equals(first.formula) && right?.equals(second.formula));

    if (
      !(
        (left?.equals(first.formula) && right?.equals(second.formula)) ||
        (left?.equals(second.formula) && right?.equals(first.formula))
      )
    ) {
      throw new Error(
        `Cannot apply rule ${this.toString()} with formulae ${first.formula.toString()} and ${second.formula.toString()}`,
      );
    }
  }
}

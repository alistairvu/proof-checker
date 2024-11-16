import { Falsum, Negation } from "../formula";
import { Rule, type ProofLine } from "../rule";
import { AsmpIntro } from "./AsmpIntro";

// Negation Elimination
export class NotElim extends Rule {
  toString() {
    return "¬ Elim";
  }

  checkLineCount(lines: ProofLine[]) {
    if (lines.length !== 3) {
      throw new Error(`${this.toString()} involves three lines.`);
    }
  }

  checkReferences(lines: ProofLine[]) {
    const [notA, falsum, a] = lines as [ProofLine, ProofLine, ProofLine];

    if (a.references.length !== 2) {
      throw new Error(`${this.toString()} accepts exactly two references.`);
    }

    if (a.references[0] !== notA.line || a.references[1] !== falsum.line) {
      throw new Error("Incorrect set of references.");
    }
  }

  checkAssumptions(lines: ProofLine[]): void {
    const [notA, falsum, a] = lines as [ProofLine, ProofLine, ProofLine];

    if (!falsum.assumptions.includes(notA.line)) {
      throw new Error("Incorrect set of assumptions.");
    }

    const targetSet = new Set(falsum.assumptions);
    targetSet.delete(notA.line);

    if (a.assumptions.length !== targetSet.size) {
      throw new Error("Incorrect set of assumptions.");
    }

    for (const line of a.assumptions) {
      if (!targetSet.has(line)) {
        throw new Error("Incorrect set of assumptions.");
      }
    }
  }

  checkFormulas(lines: ProofLine[]): void {
    const [notA, falsum, a] = lines as [ProofLine, ProofLine, ProofLine];

    const errorMessage = `Cannot apply rule ${this.toString()} for lines ${lines.map((x) => x.line).join(", ")}.`;

    if (!(notA.rule instanceof AsmpIntro)) {
      throw new Error(errorMessage);
    }

    if (!(notA.formula instanceof Negation)) {
      throw new Error(errorMessage);
    }

    if (!(falsum.formula instanceof Falsum)) {
      throw new Error(errorMessage);
    }

    const [child] = notA.formula.getChildren();

    if (!child?.equals(a.formula)) {
      throw new Error(errorMessage);
    }
  }
}

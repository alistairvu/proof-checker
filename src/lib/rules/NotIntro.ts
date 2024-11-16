import { Falsum, Negation } from "../formula";
import { Rule, type ProofLine } from "../rule";
import { AsmpIntro } from "./AsmpIntro";

// Negation Introduction
export class NotIntro extends Rule {
  toString() {
    return "¬ Intr";
  }

  checkLineCount(lines: ProofLine[]) {
    if (lines.length !== 3) {
      throw new Error(`${this.toString()} involves three lines.`);
    }
  }

  checkReferences(lines: ProofLine[]) {
    const [a, falsum, notA] = lines as [ProofLine, ProofLine, ProofLine];

    if (notA.references.length !== 2) {
      throw new Error(`${this.toString()} accepts exactly two references.`);
    }

    if (notA.references[0] !== a.line || notA.references[1] !== falsum.line) {
      throw new Error("Incorrect set of references.");
    }
  }

  checkAssumptions(lines: ProofLine[]): void {
    const [a, falsum, notA] = lines as [ProofLine, ProofLine, ProofLine];

    if (!falsum.assumptions.includes(a.line)) {
      throw new Error("Incorrect set of assumptions.");
    }

    const targetSet = new Set(falsum.assumptions);
    targetSet.delete(a.line);

    if (notA.assumptions.length !== targetSet.size) {
      throw new Error("Incorrect set of assumptions.");
    }

    for (const line of notA.assumptions) {
      if (!targetSet.has(line)) {
        throw new Error("Incorrect set of assumptions.");
      }
    }
  }

  checkFormulas(lines: ProofLine[]): void {
    const [a, falsum, notA] = lines as [ProofLine, ProofLine, ProofLine];

    const errorMessage = `Cannot apply rule ${this.toString()} for lines ${lines.map((x) => x.line).join(", ")}.`;

    if (!(a.rule instanceof AsmpIntro)) {
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

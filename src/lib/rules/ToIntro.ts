import { Implication } from "../formula";
import { Rule, type ProofLine } from "../rule";
import { AsmpIntro } from "./AsmpIntro";

// Implication Introduction
export class ToIntro extends Rule {
  toString() {
    return "→ Intr";
  }

  checkLineCount(lines: ProofLine[]) {
    if (lines.length !== 3) {
      throw new Error(`${this.toString()} involves three lines.`);
    }
  }

  checkReferences(lines: ProofLine[]) {
    const [a, b, aToB] = lines as [ProofLine, ProofLine, ProofLine];

    if (aToB.references.length !== 2) {
      throw new Error(`${this.toString()} accepts exactly two references.`);
    }

    if (aToB.references[0] !== a.line || aToB.references[1] !== b.line) {
      throw new Error("Incorrect set of references.");
    }
  }

  checkAssumptions(lines: ProofLine[]): void {
    const [a, b, aToB] = lines as [ProofLine, ProofLine, ProofLine];

    const targetSet = new Set(b.assumptions);
    targetSet.delete(a.line);

    if (aToB.assumptions.length !== targetSet.size) {
      throw new Error("Incorrect set of assumptions.");
    }

    for (const line of aToB.assumptions) {
      if (!targetSet.has(line)) {
        throw new Error("Incorrect set of assumptions.");
      }
    }
  }

  checkFormulas(lines: ProofLine[]): void {
    const [a, b, aToB] = lines as [ProofLine, ProofLine, ProofLine];

    const errorMessage = `Cannot apply rule ${this.toString()} for lines ${lines.map((x) => x.line).join(", ")}.`;

    if (!(a.rule instanceof AsmpIntro)) {
      throw new Error(errorMessage);
    }

    if (!(aToB.formula instanceof Implication)) {
      throw new Error(errorMessage);
    }

    const [left, right] = aToB.formula.getChildren();

    if (!left?.equals(a.formula) || !right?.equals(b.formula)) {
      throw new Error(errorMessage);
    }
  }
}

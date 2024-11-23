import { Falsum, Negation } from "../formula";
import { Rule, type ProofLine } from "../rule";

// Falsum Introduction
export class FalsumIntro extends Rule {
  toString() {
    return "Falsum Introduction";
  }

  checkLineCount(lines: ProofLine[]) {
    if (lines.length !== 3) {
      throw new Error(`${this.toString()} involves three lines.`);
    }
  }

  checkReferences(lines: ProofLine[]) {
    const [a, notA, falsum] = lines as [ProofLine, ProofLine, ProofLine];

    if (falsum.references.length !== 2) {
      throw new Error(`${this.toString()} accepts exactly two references.`);
    }

    if (falsum.references[0] !== a.line || falsum.references[1] !== notA.line) {
      throw new Error("Incorrect set of references.");
    }
  }

  checkAssumptions(lines: ProofLine[]): void {
    const [a, notA, falsum] = lines as [ProofLine, ProofLine, ProofLine];

    const targetSet = new Set(a.assumptions);

    for (const line of notA.assumptions) {
      targetSet.add(line);
    }

    if (falsum.assumptions.length !== targetSet.size) {
      throw new Error("Incorrect set of assumptions.");
    }

    for (const line of falsum.assumptions) {
      if (!targetSet.has(line)) {
        throw new Error("Incorrect set of assumptions.");
      }
    }
  }

  checkFormulas(lines: ProofLine[]): void {
    const [a, notA, falsum] = lines as [ProofLine, ProofLine, ProofLine];

    const errorMessage = `Cannot apply rule ${this.toString()} for lines ${lines.map((x) => x.line).join(", ")}.`;

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

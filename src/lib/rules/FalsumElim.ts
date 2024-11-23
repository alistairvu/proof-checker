import { Falsum } from "../formula";
import { Rule, type ProofLine } from "../rule";

// Falsum Elimination
export class FalsumElim extends Rule {
  toString() {
    return "Falsum Elimination";
  }

  checkLineCount(lines: ProofLine[]) {
    if (lines.length !== 2) {
      throw new Error(`${this.toString()} involves two lines.`);
    }
  }

  checkReferences(lines: ProofLine[]) {
    const [falsum, a] = lines as [ProofLine, ProofLine];

    if (a.references.length !== 1) {
      throw new Error(`${this.toString()} accepts exactly two references.`);
    }

    if (a.references[0] !== falsum.line) {
      throw new Error("Incorrect set of references.");
    }
  }

  checkAssumptions(lines: ProofLine[]): void {
    const [falsum, a] = lines as [ProofLine, ProofLine];

    const targetSet = new Set(falsum.assumptions);

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
    const [falsum] = lines as [ProofLine, ProofLine];
    const errorMessage = `Cannot apply rule ${this.toString()} for lines ${lines.map((x) => x.line).join(", ")}.`;

    if (!(falsum.formula instanceof Falsum)) {
      throw new Error(errorMessage);
    }
  }
}

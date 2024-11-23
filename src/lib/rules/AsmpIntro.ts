import { Rule, type ProofLine } from "../rule";

// Assumption Introduction
export class AsmpIntro extends Rule {
  toString() {
    return "Assumption Introduction";
  }

  checkLineCount(lines: ProofLine[]) {
    if (lines.length !== 1) {
      throw new Error(`${this.toString()} involves only one line.`);
    }
  }

  checkReferences(lines: ProofLine[]) {
    const [first] = lines as [ProofLine];

    if (first.references.length !== 0) {
      throw new Error(`${this.toString()} does not accept any references.`);
    }
  }

  checkAssumptions(lines: ProofLine[]): void {
    const [first] = lines as [ProofLine];

    if (first.assumptions.length !== 1) {
      throw new Error("Incorrect set of assumptions.");
    }

    if (first.assumptions[0] !== first.line) {
      throw new Error("Incorrect set of assumptions.");
    }
  }

  checkFormulas(_lines: ProofLine[]): void {
    return;
  }
}

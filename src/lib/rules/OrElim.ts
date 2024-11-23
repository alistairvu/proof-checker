import { Disjunction } from "../formula";
import { Rule, type ProofLine } from "../rule";
import { AsmpIntro } from "./AsmpIntro";

// Disjunction Elimination
export class OrElim extends Rule {
  toString() {
    return "Disjunction Elimination";
  }

  checkLineCount(lines: ProofLine[]) {
    if (lines.length !== 6) {
      throw new Error(`${this.toString()} involves two lines.`);
    }
  }

  checkReferences(lines: ProofLine[]) {
    const [aOrB, a, aFromC, b, bFromC, c] = lines as [
      ProofLine,
      ProofLine,
      ProofLine,
      ProofLine,
      ProofLine,
      ProofLine,
    ];

    if (c.references.length !== 5) {
      throw new Error(`${this.toString()} accepts exactly five references.`);
    }

    if (
      c.references[0] !== aOrB.line ||
      c.references[1] !== a.line ||
      c.references[2] !== aFromC.line ||
      c.references[3] !== b.line ||
      c.references[4] !== bFromC.line
    ) {
      throw new Error("Incorrect set of references.");
    }
  }

  checkAssumptions(lines: ProofLine[]): void {
    const [aOrB, a, cFromA, b, cFromB, c] = lines as [
      ProofLine,
      ProofLine,
      ProofLine,
      ProofLine,
      ProofLine,
      ProofLine,
    ];

    if (
      !(
        cFromA.assumptions.includes(a.line) &&
        cFromB.assumptions.includes(b.line)
      )
    ) {
      throw new Error("Incorrect set of assumptions.");
    }

    const targetSet = new Set(aOrB.assumptions);

    for (const line of cFromA.assumptions) {
      targetSet.add(line);
    }

    for (const line of cFromB.assumptions) {
      targetSet.add(line);
    }

    targetSet.delete(a.line);
    targetSet.delete(b.line);

    if (c.assumptions.length !== targetSet.size) {
      throw new Error("Incorrect set of assumptions.");
    }

    for (const line of c.assumptions) {
      if (!targetSet.has(line)) {
        throw new Error("Incorrect set of assumptions.");
      }
    }
  }

  checkFormulas(lines: ProofLine[]): void {
    const [aOrB, a, cFromA, b, cFromB, c] = lines as [
      ProofLine,
      ProofLine,
      ProofLine,
      ProofLine,
      ProofLine,
      ProofLine,
    ];

    const errorMessage = `Cannot apply rule ${this.toString()} for lines ${lines.map((x) => x.line).join(", ")}.`;

    if (!(a.rule instanceof AsmpIntro) || !(b.rule instanceof AsmpIntro)) {
      throw new Error(errorMessage);
    }

    if (
      !cFromA.formula.equals(c.formula) ||
      !cFromB.formula.equals(c.formula)
    ) {
      throw new Error(errorMessage);
    }

    if (!(aOrB.formula instanceof Disjunction)) {
      throw new Error(errorMessage);
    }

    const [left, right] = aOrB.formula.getChildren();

    if (!left?.equals(a.formula) || !right?.equals(b.formula)) {
      throw new Error(errorMessage);
    }
  }
}
